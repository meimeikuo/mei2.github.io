import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export interface Competition {
  id: string;
  year: number;
  name: string;
  rank: string;
  medal?: 'gold' | 'silver' | 'bronze';
  details?: string;
  link?: string;
}

export interface DynamicLink {
  id: string;
  title: string;
  imageUrl: string;
  url: string;
  description?: string;
  linkText?: string;
  iconName?: string;
}

export const defaultContent = {
  heroTitleEn: "IFBB Classic Physique Pro",
  heroQuoteEn: "Discipline. Aesthetics. Legacy.",
  heroSubquoteEn: "Representing Taiwan on the global stage.",
  heroTitleCn: "IFBB 古典職業健美選手",
  heroQuoteCn: "自律。美學。傳奇。",
  heroSubquoteCn: "代表台灣站上世界舞台。",
  heroBgImages: [
    "https://lh3.googleusercontent.com/pw/AP1GczPLdJHNa6h83EntmYan3Q2-3G7IBJDdPCHmPkORJfyVEtjzbQzarfMgrWz2OTBSMi3O2KhS42v1y_n-ihKkV8iMbQboW379yZeQVYB827o6T9pjSLA=w1800",
    "https://lh3.googleusercontent.com/pw/AP1GczMoxHodg09o6FUmzNuuVdnMsZzrCGq-Rf_UtyuuCj6CpXY1DQNSdvC7RlwaNl7TXYgF3Zdyyru7KCU-nIY9jAGffjUyLTWA_20tVvHUpnJFmN9L_NQ=w1800",
    "https://lh3.googleusercontent.com/pw/AP1GczPXUpuUQrDE3fqS7kRm-zSPuj1UTw5rOZaX3QYFLpLwArUlnyMCwK3NPulbi9fxGuyELhZXRDrsAZTIaZ4FQtzyWsUuJpyvtVRLiunsU4frHqwgvmo=w1800",
    "https://i.ibb.co/27KpSbD5/LINE-ALBUM-2025-251210-8.jpg",
    "https://i.ibb.co/d0Lt0Nmt/LINE-ALBUM-2025-251210-1.jpg",
    "https://i.ibb.co/4nvv349R/LINE-ALBUM-2025-251210-2.jpg",
    "https://i.ibb.co/mFC2jwRj/LINE-ALBUM-2025-251210-3.jpg",
    "https://i.ibb.co/VWjDkwrX/LINE-ALBUM-2025-251210-4.jpg",
    "https://i.ibb.co/354QWp6g/LINE-ALBUM-2025-251210-5.jpg",
    "https://i.ibb.co/8gZwnFN6/LINE-ALBUM-2025-251210-6.jpg",
    "https://i.ibb.co/wtqfqq8/LINE-ALBUM-2025-251210-7.jpg",
    "https://i.ibb.co/YBbQRDdJ/LINE-ALBUM-2025-251210-9.jpg"
  ],
  competitionsEn: [
    { id: 'comp-en-1', year: 2025, name: "IFBB Huanji China Pro", rank: "No. 5" },
    { id: 'comp-en-2', year: 2025, name: "IFBB Asian Championship", rank: "No. 4" },
    { id: 'comp-en-3', year: 2025, name: "Japan Pro Men's Classic Physique", rank: "No. 7", link: "https://www.ifbbpro.com/competition/2025-japan-pro/" },
    { id: 'comp-en-4', year: 2024, name: "IFBB Taiwan Pro", rank: "No. 3", medal: 'bronze' as const },
    { id: 'comp-en-5', year: 2024, name: "IFBB Huanji China Pro", rank: "No. 6" },
    { id: 'comp-en-6', year: 2023, name: "IFBB Pro League District of Taiwan Pro CP", rank: "No. 8" },
    { id: 'comp-en-7', year: 2023, name: "IFBB Monsterzym Pro Classic Physique", rank: "No. 13" },
    { id: 'comp-en-8', year: 2022, name: "NPC Worldwide Taiwan Proqualifier", rank: "Overall Champion / Pro Card Earned", medal: 'gold' as const, details: "Traditional BB Light Heavyweight Champion, Classic Physique Class B Champion" }
  ] as Competition[],
  competitionsCn: [
    { id: 'comp-cn-1', year: 2025, name: "IFBB 北京寰際職業賽", rank: "No. 5" },
    { id: 'comp-cn-2', year: 2025, name: "IFBB 亞洲錦標賽", rank: "No. 4" },
    { id: 'comp-cn-3', year: 2025, name: "日本職業賽 男子古典健美", rank: "No. 7", link: "https://www.ifbbpro.com/competition/2025-japan-pro/" },
    { id: 'comp-cn-4', year: 2024, name: "IFBB 台灣職業賽", rank: "No. 3 銅牌", medal: 'bronze' as const },
    { id: 'comp-cn-5', year: 2024, name: "IFBB 北京寰際古典職業賽", rank: "No. 6" },
    { id: 'comp-cn-6', year: 2023, name: "IFBB 台灣職業賽", rank: "No. 8" },
    { id: 'comp-cn-7', year: 2023, name: "IFBB Monsterzym 職業賽", rank: "No. 13" },
    { id: 'comp-cn-8', year: 2022, name: "NPC Worldwide 台灣職業卡資格賽", rank: "全場總冠軍 / 取得職業卡", medal: 'gold' as const, details: "傳統健美輕重量級冠軍、古典健美B組冠軍、古典健美全場總冠軍" }
  ] as Competition[],
  servicesList: [
    { id: 'srv1', title: '課程諮詢', description: '客製化訓練安排', linkText: '立即開始', iconName: 'Dumbbell', imageUrl: '', url: "https://forms.gle/ckanBAG2wGVjQ4FD6" },
    { id: 'srv2', title: '鰻魚訂購', description: '頂級白燒鰻', linkText: '立即訂購', iconName: 'UtensilsCrossed', imageUrl: '', url: "https://forms.gle/AjnyUgcKQ6jjgDyL9" },
    { id: 'srv3', title: 'Instagram', description: '追蹤日常訓練', linkText: '@jasonhuang_ifbbpro', iconName: 'Instagram', imageUrl: '', url: "https://www.instagram.com/jasonhuang_ifbbpro/" },
    { id: 'srv4', title: '抖音', description: '短影音與動態', linkText: '傑森 黃文新IFBBPRO', iconName: 'PlaySquare', imageUrl: '', url: "https://v.douyin.com/nnjXlvZahJw/" }
  ] as DynamicLink[],
  sponsorsList: [
    { id: 'spn1', title: 'MyProtein', description: '乳清蛋白', linkText: '@myproteintw', iconName: 'ShoppingBag', imageUrl: '', url: "https://creatorlink.shop/4bAhKNj" },
    { id: 'spn2', title: 'Phargoods 法古斯', description: '保健品', linkText: '@phargoods_tw', iconName: 'Pill', imageUrl: '', url: "https://www.phargoods.com/" },
    { id: 'spn3', title: 'Riseme', description: '運動補給品', linkText: '@riseme.tw', iconName: 'Zap', imageUrl: '', url: "https://www.riseme.com.tw/" }
  ] as DynamicLink[],
  othersList: [
    { id: 'oth1', title: 'SHARP SWORD 利劍官方店', description: '康神自創品牌服飾', linkText: '前往選購', iconName: 'ShoppingCart', imageUrl: "https://lh3.googleusercontent.com/pw/AP1GczN9JKlLatxnevqDOYx7uwyAEvYrhqidElAQRXjhRolxxlTzYrM5MCV1-VEbde7uWwKS0nrezr9azweDZ1rE7qcMM-VfuSBpbN3IP93ZObCH9K10I4Q=w1200", url: "https://m.tb.cn/h.i3elcqLzzvjzVU0" }
  ] as DynamicLink[],
  discountCode: "JASON666",
  footerTitleCn: "新爺裝逼",
  footerTitleEn: "Jason Huang",
  footerCopyrightCn: "新爺裝逼 IFBB Pro. 版權所有。",
  footerCopyrightEn: "Jason Huang IFBB Pro. All Rights Reserved.",
  footerIg: "@jasonhuang_ifbbpro",
  footerEmail: "contact@jasonhuang.com"
};

export const migrateData = (data: any) => {
  const merged = { ...defaultContent, ...data };

  // Migrate Services
  if (!data.servicesList && (data.courseLink || data.eelLink || data.igLink || data.douyinUrl)) {
    merged.servicesList = [];
    if (data.courseLink) merged.servicesList.push({ id: `srv-${Date.now()}-1`, title: '課程諮詢', description: '客製化訓練安排', linkText: '立即開始', iconName: 'Dumbbell', imageUrl: '', url: data.courseLink });
    if (data.eelLink) merged.servicesList.push({ id: `srv-${Date.now()}-2`, title: '鰻魚訂購', description: '頂級白燒鰻', linkText: '立即訂購', iconName: 'UtensilsCrossed', imageUrl: '', url: data.eelLink });
    if (data.igLink) merged.servicesList.push({ id: `srv-${Date.now()}-3`, title: 'Instagram', description: '追蹤日常訓練', linkText: '@jasonhuang_ifbbpro', iconName: 'Instagram', imageUrl: '', url: data.igLink });
    if (data.douyinUrl) merged.servicesList.push({ id: `srv-${Date.now()}-4`, title: '抖音', description: '短影音與動態', linkText: '傑森 黃文新IFBBPRO', iconName: 'PlaySquare', imageUrl: '', url: data.douyinUrl });
  }

  // Migrate Sponsors
  if (!data.sponsorsList && (data.myProteinLink || data.phargoodsLink || data.risemeLink)) {
    merged.sponsorsList = [];
    if (data.myProteinLink) merged.sponsorsList.push({ id: `spn-${Date.now()}-1`, title: 'MyProtein', description: '乳清蛋白', linkText: '@myproteintw', iconName: 'ShoppingBag', imageUrl: '', url: data.myProteinLink });
    if (data.phargoodsLink) merged.sponsorsList.push({ id: `spn-${Date.now()}-2`, title: 'Phargoods 法古斯', description: '保健品', linkText: '@phargoods_tw', iconName: 'Pill', imageUrl: '', url: data.phargoodsLink });
    if (data.risemeLink) merged.sponsorsList.push({ id: `spn-${Date.now()}-3`, title: 'Riseme', description: '運動補給品', linkText: '@riseme.tw', iconName: 'Zap', imageUrl: '', url: data.risemeLink });
  }

  // Migrate Others (previously Sharpsword)
  if (!data.othersList && data.sharpswordLink) {
    merged.othersList = [];
    merged.othersList.push({
      id: `oth-${Date.now()}-1`,
      title: data.sharpswordTitleCn || 'SHARP SWORD 利劍官方店',
      description: data.sharpswordDescCn || '康神自創品牌服飾',
      linkText: data.sharpswordCtaCn || '前往選購',
      iconName: 'ShoppingCart',
      imageUrl: data.sharpswordImage || '',
      url: data.sharpswordLink
    });
  }

  // Ensure arrays have the new fields for existing items if they were already migrated previously
  if (merged.servicesList) {
    merged.servicesList = merged.servicesList.map((item: DynamicLink) => ({
      ...item,
      description: item.description || '',
      linkText: item.linkText || '',
      iconName: item.iconName || 'Link'
    }));
  }
  
  if (merged.sponsorsList) {
    merged.sponsorsList = merged.sponsorsList.map((item: DynamicLink) => ({
      ...item,
      description: item.description || '',
      linkText: item.linkText || '',
      iconName: item.iconName || 'Link'
    }));
  }

  if (merged.othersList) {
    merged.othersList = merged.othersList.map((item: DynamicLink) => ({
      ...item,
      description: item.description || '',
      linkText: item.linkText || '',
      iconName: item.iconName || 'Link'
    }));
  }

  return merged;
};

export const useSiteContent = () => {
  const [content, setContent] = useState(defaultContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }
    const docRef = doc(db, 'site', 'content');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setContent(migrateData(docSnap.data()));
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching live content: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { content, loading };
};


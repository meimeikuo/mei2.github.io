import React, { useState, useEffect } from 'react';
import { db, auth, loginWithEmail, logout, storage } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Save, LogOut, Loader2, Image as ImageIcon, Plus, Trash2, Link, Dumbbell, UtensilsCrossed, Instagram, PlaySquare, ShoppingBag, ShoppingCart, Pill, Zap, ArrowUp, ArrowDown, ArrowDownAZ } from 'lucide-react';
import { defaultContent, migrateData, DynamicLink } from '../hooks/useSiteContent';

const IconMap: Record<string, React.ElementType> = {
  Link,
  Dumbbell,
  UtensilsCrossed,
  Instagram,
  PlaySquare,
  ShoppingBag,
  ShoppingCart,
  Pill,
  Zap
};

const ADMIN_EMAILS = [
  'jas60523@gmail.com', 
  'yoshiki840417@gmail.com',
  'jasmine.kuo@neurobraindynamics.com'
];

const CHARACTERS = [
  {
    id: 'char-a',
    name: '咩嚕咩嚕咩',
    email: 'jas60523@gmail.com',
    avatarUrl: 'https://lh3.googleusercontent.com/pw/AP1GczPdiKG6V033FtlvYMCb2_lwkpeT3H-FZaKPuQXCKOBtLZGO-fCZcSbb1L-g4que8XRgFfV-UIhghMlAAL8l3_V4_Twqu1ZsGpkOFXUOXFlN-sgbLXQ=w2400',
  },
  {
    id: 'char-b',
    name: '新爺裝逼',
    email: 'yoshiki840417@gmail.com',
    avatarUrl: 'https://lh3.googleusercontent.com/pw/AP1GczPMqw7UqpBTpL6kGrIFoG3F_qxX-zWl_pGRLblA1EwH3mY2Bci48veuJL6hbcCc5lpxn5AiLQxXisKxMv3UDSB9n1D3qzxxFPCx5vqyV_JsoUYwsfI=w2400',
  }
];

type Tab = 'hero' | 'history' | 'services' | 'others' | 'sponsors' | 'footer';

export const Admin: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [siteData, setSiteData] = useState<any>(defaultContent);
  const [selectedCharacter, setSelectedCharacter] = useState<typeof CHARACTERS[0] | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('hero');
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && currentUser.email && !ADMIN_EMAILS.includes(currentUser.email)) {
        logout();
        setLoginError("您沒有管理員權限");
        setUser(null);
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user && db) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!db) return;
    try {
      const docRef = doc(db, 'site', 'content');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSiteData(migrateData(docSnap.data()));
      } else {
        setSiteData(migrateData({}));
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    if (!db) {
      alert("Firebase 未設定");
      setSaving(false);
      return;
    }
    try {
      const docRef = doc(db, 'site', 'content');
      await setDoc(docRef, siteData, { merge: true });
      alert("儲存成功！網頁已自動更新。");
    } catch (error) {
      console.error("Error saving data: ", error);
      alert("儲存失敗，請確認您是否有編輯權限。");
    }
    setSaving(false);
  };

  const handleSelectCharacter = (char: typeof CHARACTERS[0]) => {
    setSelectedCharacter(char);
    setEmail(char.email);
    setLoginError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const loginEmail = selectedCharacter ? selectedCharacter.email : email;
    if (!loginEmail) {
      setLoginError('請先選擇角色');
      return;
    }
    setLoginError('');
    setLoading(true);
    try {
      const userCredential = await loginWithEmail(loginEmail, password);
      if (!userCredential.user.email || !ADMIN_EMAILS.includes(userCredential.user.email)) {
        await logout();
        setLoginError("您沒有管理員權限");
      }
    } catch (error: any) {
      setLoginError("登入失敗，請確認密碼是否正確。");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSiteData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string, isArray: boolean = false, arrayIndex?: number) => {
    if (!e.target.files || e.target.files.length === 0 || !storage) return;
    const file = e.target.files[0];
    
    setUploadingImage(isArray ? `${fieldName}-${arrayIndex}` : fieldName);
    
    try {
      const fileRef = ref(storage, `images/${Date.now()}_${file.name}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      
      if (isArray && typeof arrayIndex === 'number') {
        const newImages = [...siteData[fieldName]];
        newImages[arrayIndex] = url;
        setSiteData(prev => ({ ...prev, [fieldName]: newImages }));
      } else if (isArray) {
        // Appending to array
        setSiteData(prev => ({ ...prev, [fieldName]: [...prev[fieldName], url] }));
      } else {
        setSiteData(prev => ({ ...prev, [fieldName]: url }));
      }
    } catch (err) {
      console.error("Upload error", err);
      alert("上傳圖片失敗！請確認 Firebase Storage 是否已開通且設定好權限 (Rules)。若尚未設定，您可以直接貼上網址。");
    }
    
    setUploadingImage(null);
  };

  const handleListImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, listName: string, index: number) => {
    if (!e.target.files || e.target.files.length === 0 || !storage) return;
    const file = e.target.files[0];
    
    setUploadingImage(`${listName}-${index}`);
    
    try {
      const fileRef = ref(storage, `images/${Date.now()}_${file.name}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      
      const newList = [...siteData[listName]];
      newList[index].imageUrl = url;
      setSiteData(prev => ({ ...prev, [listName]: newList }));
    } catch (err) {
      console.error("Upload error", err);
      alert("上傳圖片失敗！");
    }
    
    setUploadingImage(null);
  };

  const addListItem = (listName: string) => {
    const newItem: DynamicLink = { id: `${listName}-${Date.now()}`, title: '', imageUrl: '', url: '' };
    setSiteData(prev => ({ ...prev, [listName]: [...(prev[listName] || []), newItem] }));
  };

  const removeListItem = (listName: string, index: number) => {
    const newList = [...(siteData[listName] || [])];
    newList.splice(index, 1);
    setSiteData(prev => ({ ...prev, [listName]: newList }));
  };

  const handleListItemChange = (listName: string, index: number, field: keyof DynamicLink, value: string) => {
    const newList = [...(siteData[listName] || [])];
    newList[index] = { ...newList[index], [field]: value };
    setSiteData(prev => ({ ...prev, [listName]: newList }));
  };

  const removeHeroImage = (index: number) => {
    const newImages = [...siteData.heroBgImages];
    newImages.splice(index, 1);
    setSiteData(prev => ({ ...prev, heroBgImages: newImages }));
  };

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white"><Loader2 className="animate-spin" /></div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 select-none">
        <div className="w-full max-w-3xl flex flex-col items-center">
          {/* 1. 頁面標題 */}
          <h1 className="text-4xl md:text-5xl font-extrabold mb-12 text-center text-white tracking-wider">
            請選擇角色
          </h1>

          {/* 2. 角色卡片區域 (Flex layout 左右並排) */}
          <div className="flex flex-row items-center justify-center gap-8 md:gap-14 mb-10 w-full">
            {CHARACTERS.map((char) => {
              const isSelected = selectedCharacter?.id === char.id;
              return (
                <div
                  key={char.id}
                  onClick={() => handleSelectCharacter(char)}
                  className={`group relative flex flex-col items-center cursor-pointer p-8 md:p-10 rounded-3xl bg-zinc-900/90 border transition-all duration-300 transform hover:-translate-y-3 hover:scale-105 shadow-2xl ${
                    isSelected
                      ? 'border-yellow-500 bg-zinc-800/90 shadow-[0_0_40px_rgba(250,204,21,0.35)] scale-105'
                      : 'border-zinc-800/80 hover:border-zinc-600 opacity-80 hover:opacity-100'
                  }`}
                >
                  {/* 3. 卡片內部結構: 頭像 (GIF - 放大一倍) */}
                  <div className={`relative w-56 h-56 md:w-64 md:h-64 rounded-3xl overflow-hidden bg-black/40 flex items-center justify-center p-3 transition-all duration-300 ${
                    isSelected 
                      ? 'ring-4 ring-yellow-400 shadow-[0_0_40px_rgba(250,204,21,0.8)] animate-pulse border-2 border-yellow-400' 
                      : 'border border-zinc-700/60 group-hover:border-zinc-500'
                  }`}>
                    <img
                      src={char.avatarUrl}
                      alt={char.name}
                      className={`w-full h-full object-contain object-center origin-center transition-transform duration-300 ${
                        char.id === 'char-b' ? 'scale-150 -translate-y-[25%]' : ''
                      }`}
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* 角色名稱 */}
                  <span className={`mt-6 font-bold text-xl md:text-2xl text-center transition-colors ${
                    isSelected ? 'text-yellow-400' : 'text-zinc-300 group-hover:text-white'
                  }`}>
                    {char.name}
                  </span>
                </div>
              );
            })}
          </div>

          {/* 錯誤提示 */}
          {loginError && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-6 py-3.5 rounded-xl mb-6 text-base text-center animate-fade-in max-w-md w-full">
              {loginError}
            </div>
          )}

          {/* 4. 動態顯示密碼框 (當選中角色時才呈現) */}
          {selectedCharacter && (
            <form onSubmit={handleLogin} className="w-full max-w-md flex flex-col items-center gap-4 animate-fade-in transition-all duration-300">
              <div className="w-full">
                <div className="text-sm text-zinc-400 mb-2 text-center">
                  登入角色：<span className="text-yellow-400 font-semibold text-base">{selectedCharacter.name}</span>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoFocus
                  placeholder="請輸入密碼"
                  className="w-full bg-zinc-900/90 border border-zinc-700 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 rounded-2xl p-4 text-white text-center text-lg outline-none transition-all placeholder:text-zinc-500 shadow-inner"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-yellow-500 text-black py-4 rounded-2xl font-bold text-lg hover:bg-yellow-400 active:scale-98 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
              >
                {loading ? <Loader2 className="animate-spin" size={24} /> : "登 入"}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  const renderInputField = (label: string, name: string, isTextarea = false) => (
    <div className="mb-6">
      <label className="block text-sm font-medium text-zinc-400 mb-2">{label}</label>
      {isTextarea ? (
        <textarea name={name} value={siteData[name] || ''} onChange={handleChange} rows={3} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:border-yellow-500 outline-none" />
      ) : (
        <input type="text" name={name} value={siteData[name] || ''} onChange={handleChange} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:border-yellow-500 outline-none" />
      )}
    </div>
  );

  const renderImageField = (label: string, name: string) => (
    <div className="mb-6">
      <label className="block text-sm font-medium text-zinc-400 mb-2">{label}</label>
      <div className="flex gap-4 items-start">
        <div className="flex-1">
          <input type="text" name={name} value={siteData[name] || ''} onChange={handleChange} placeholder="輸入圖片 URL..." className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:border-yellow-500 outline-none mb-2" />
          <label className="cursor-pointer bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded-lg text-sm inline-flex items-center gap-2 transition-colors">
            {uploadingImage === name ? <Loader2 className="animate-spin" size={16} /> : <ImageIcon size={16} />}
            {uploadingImage === name ? '上傳中...' : '從電腦上傳圖片'}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, name)} disabled={!!uploadingImage} />
          </label>
        </div>
        {siteData[name] && (
          <div className="w-32 h-32 bg-zinc-800 rounded-lg overflow-hidden border border-zinc-700 flex-shrink-0">
            <img src={siteData[name]} alt="Preview" className="w-full h-full object-cover" />
          </div>
        )}
      </div>
    </div>
  );

  const ICON_OPTIONS = [
    { value: 'Link', label: '連結 (Link)' },
    { value: 'Dumbbell', label: '啞鈴 (Dumbbell)' },
    { value: 'UtensilsCrossed', label: '餐具 (UtensilsCrossed)' },
    { value: 'Instagram', label: 'Instagram' },
    { value: 'PlaySquare', label: '播放 (PlaySquare)' },
    { value: 'ShoppingBag', label: '購物袋 (ShoppingBag)' },
    { value: 'ShoppingCart', label: '購物車 (ShoppingCart)' },
    { value: 'Pill', label: '藥丸/保健品 (Pill)' },
    { value: 'Zap', label: '閃電/能量 (Zap)' },
  ];

  const renderDynamicListEditor = (title: string, listName: string) => (
    <div className="animate-fade-in-up">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white border-l-4 border-yellow-500 pl-3">{title}</h2>
        <button 
          onClick={() => addListItem(listName)}
          className="bg-yellow-500 text-black px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-yellow-400 transition-colors"
        >
          <Plus size={16} /> 新增項目
        </button>
      </div>

      <div className="space-y-6">
        {(siteData[listName] || []).map((item: DynamicLink, index: number) => (
          <div key={item.id} className="bg-zinc-950 p-5 rounded-xl border border-zinc-800 relative">
            <button 
              onClick={() => removeListItem(listName, index)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-red-400 transition-colors"
              title="刪除"
            >
              <Trash2 size={20} />
            </button>
            
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">標題 (Title)</label>
                <input 
                  type="text" 
                  value={item.title} 
                  onChange={(e) => handleListItemChange(listName, index, 'title', e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white focus:border-yellow-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">網址 (URL)</label>
                <input 
                  type="text" 
                  value={item.url} 
                  onChange={(e) => handleListItemChange(listName, index, 'url', e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white focus:border-yellow-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">副標題/說明 (Description)</label>
                <input 
                  type="text" 
                  value={item.description || ''} 
                  onChange={(e) => handleListItemChange(listName, index, 'description', e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white focus:border-yellow-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">按鈕/連結文字 (Link Text)</label>
                <input 
                  type="text" 
                  value={item.linkText || ''} 
                  onChange={(e) => handleListItemChange(listName, index, 'linkText', e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white focus:border-yellow-500 outline-none"
                />
              </div>
            </div>

            <div className="mt-4 grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">選擇圖標 (Icon)</label>
                <div className="grid grid-cols-5 gap-2">
                  {ICON_OPTIONS.map(opt => {
                    const IconComponent = IconMap[opt.value] || Link;
                    const isSelected = (item.iconName || 'Link') === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        title={opt.label}
                        onClick={() => handleListItemChange(listName, index, 'iconName', opt.value)}
                        className={`flex items-center justify-center p-3 rounded-lg border transition-all ${
                          isSelected 
                            ? 'bg-yellow-500/20 border-yellow-500 text-yellow-500' 
                            : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:border-zinc-500 hover:text-white'
                        }`}
                      >
                        <IconComponent size={20} />
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">或輸入圖片 URL (會優先顯示)</label>
                <div className="flex gap-4 items-start">
                  <div className="flex-1">
                    <input 
                      type="text" 
                      value={item.imageUrl} 
                      onChange={(e) => handleListItemChange(listName, index, 'imageUrl', e.target.value)}
                      placeholder="圖片 URL..." 
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white focus:border-yellow-500 outline-none mb-2" 
                    />
                    <label className="cursor-pointer bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg text-sm inline-flex items-center gap-2 transition-colors">
                      {uploadingImage === `${listName}-${index}` ? <Loader2 className="animate-spin" size={16} /> : <ImageIcon size={16} />}
                      {uploadingImage === `${listName}-${index}` ? '上傳中...' : '從電腦上傳'}
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleListImageUpload(e, listName, index)} disabled={!!uploadingImage} />
                    </label>
                  </div>
                  {item.imageUrl && (
                    <div className="w-16 h-16 bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 flex-shrink-0 flex items-center justify-center">
                      <img src={item.imageUrl} alt="預覽" className="max-w-full max-h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        {(!siteData[listName] || siteData[listName].length === 0) && (
          <div className="text-center py-10 text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
            目前沒有項目，請點擊上方按鈕新增。
          </div>
        )}
      </div>
    </div>
  );

  const addCombinedCompetitionItem = () => {
    const newCn = { id: `competitionsCn-${Date.now()}`, year: new Date().getFullYear(), name: '', rank: '' };
    const newEn = { id: `competitionsEn-${Date.now()}`, year: new Date().getFullYear(), name: '', rank: '' };
    setSiteData(prev => ({ 
      ...prev, 
      competitionsCn: [newCn, ...(prev.competitionsCn || [])],
      competitionsEn: [newEn, ...(prev.competitionsEn || [])]
    }));
  };

  const removeCombinedCompetitionItem = (index: number) => {
    setSiteData(prev => {
      const newCn = [...(prev.competitionsCn || [])];
      newCn.splice(index, 1);
      const newEn = [...(prev.competitionsEn || [])];
      newEn.splice(index, 1);
      return { ...prev, competitionsCn: newCn, competitionsEn: newEn };
    });
  };

  const moveCombinedCompetitionItem = (index: number, direction: 'up' | 'down') => {
    setSiteData(prev => {
      const cnList = [...(prev.competitionsCn || [])];
      const enList = [...(prev.competitionsEn || [])];
      const length = Math.max(cnList.length, enList.length);

      if (
        (direction === 'up' && index === 0) || 
        (direction === 'down' && index === length - 1)
      ) {
        return prev;
      }
      
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      
      const tempCn = cnList[index];
      cnList[index] = cnList[targetIndex];
      cnList[targetIndex] = tempCn;
      
      const tempEn = enList[index];
      enList[index] = enList[targetIndex];
      enList[targetIndex] = tempEn;
      
      return { ...prev, competitionsCn: cnList, competitionsEn: enList };
    });
  };

  const sortCompetitionsByYear = () => {
    setSiteData(prev => {
      const cnList = [...(prev.competitionsCn || [])];
      const enList = [...(prev.competitionsEn || [])];
      
      const combined = cnList.map((cn, i) => ({ cn, en: enList[i] || { year: cn.year, name: '', rank: '' } }));
      combined.sort((a, b) => b.cn.year - a.cn.year);
      
      return {
        ...prev,
        competitionsCn: combined.map(item => item.cn),
        competitionsEn: combined.map(item => item.en)
      };
    });
  };

  const handleSharedChange = (index: number, field: string, value: any) => {
    setSiteData(prev => {
      const newCn = [...(prev.competitionsCn || [])];
      if (newCn[index]) newCn[index] = { ...newCn[index], [field]: value };
      const newEn = [...(prev.competitionsEn || [])];
      if (newEn[index]) newEn[index] = { ...newEn[index], [field]: value };
      return { ...prev, competitionsCn: newCn, competitionsEn: newEn };
    });
  };

  const renderCombinedCompetitionEditor = () => {
    const cnList = siteData.competitionsCn || [];
    const enList = siteData.competitionsEn || [];
    const length = Math.max(cnList.length, enList.length);

    return (
      <div className="animate-fade-in-up mt-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white border-l-4 border-yellow-500 pl-3">戰績列表</h3>
          <div className="flex items-center gap-3">
            <button 
              onClick={sortCompetitionsByYear}
              className="bg-zinc-800 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-zinc-700 transition-colors"
            >
              <ArrowDownAZ size={16} /> 依年份排序
            </button>
            <button 
              onClick={addCombinedCompetitionItem}
              className="bg-yellow-500 text-black px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-yellow-400 transition-colors"
            >
              <Plus size={16} /> 新增戰績
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {Array.from({ length }).map((_, index) => {
            const cnItem = cnList[index] || { year: new Date().getFullYear(), name: '', rank: '' };
            const enItem = enList[index] || { year: cnItem.year, name: '', rank: '' };
            
            return (
              <div key={cnItem.id || index} className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 relative">
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <button 
                    onClick={() => moveCombinedCompetitionItem(index, 'up')}
                    disabled={index === 0}
                    className={`text-zinc-500 hover:text-yellow-500 transition-colors ${index === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    title="上移"
                  >
                    <ArrowUp size={20} />
                  </button>
                  <button 
                    onClick={() => moveCombinedCompetitionItem(index, 'down')}
                    disabled={index === length - 1}
                    className={`text-zinc-500 hover:text-yellow-500 transition-colors ${index === length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    title="下移"
                  >
                    <ArrowDown size={20} />
                  </button>
                  <div className="w-px h-4 bg-zinc-700 mx-1"></div>
                  <button 
                    onClick={() => removeCombinedCompetitionItem(index)}
                    className="text-zinc-500 hover:text-red-400 transition-colors"
                    title="刪除"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
                
                <div className="space-y-6">
                  {/* 1. 比賽名稱 */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2 flex items-center gap-2">
                        <span className="bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded text-xs">中</span>
                        1. 比賽名稱 (Name)
                      </label>
                      <input 
                        type="text" 
                        value={cnItem.name} 
                        onChange={(e) => handleListItemChange('competitionsCn', index, 'name', e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white focus:border-yellow-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2 flex items-center gap-2">
                        <span className="bg-blue-400/20 text-blue-400 px-2 py-1 rounded text-xs">EN</span>
                        1. Competition Name
                      </label>
                      <input 
                        type="text" 
                        value={enItem.name} 
                        onChange={(e) => handleListItemChange('competitionsEn', index, 'name', e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white focus:border-yellow-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* 2. 描述 */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2 flex items-center gap-2">
                        <span className="bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded text-xs">中</span>
                        2. 描述 (Details)
                      </label>
                      <input 
                        type="text" 
                        value={cnItem.details || ''} 
                        onChange={(e) => handleListItemChange('competitionsCn', index, 'details', e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white focus:border-yellow-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2 flex items-center gap-2">
                        <span className="bg-blue-400/20 text-blue-400 px-2 py-1 rounded text-xs">EN</span>
                        2. Details
                      </label>
                      <input 
                        type="text" 
                        value={enItem.details || ''} 
                        onChange={(e) => handleListItemChange('competitionsEn', index, 'details', e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white focus:border-yellow-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* 3-6. 共享欄位 */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-zinc-800">
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2">3. 年份 (Year)</label>
                      <input 
                        type="number" 
                        value={cnItem.year} 
                        onChange={(e) => handleSharedChange(index, 'year', e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white focus:border-yellow-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2">4. 名次 (Rank)</label>
                      <input 
                        type="text" 
                        value={cnItem.rank} 
                        onChange={(e) => handleSharedChange(index, 'rank', e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white focus:border-yellow-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2">5. 獎牌 (Medal)</label>
                      <select
                        value={cnItem.medal || ''}
                        onChange={(e) => handleSharedChange(index, 'medal', e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white focus:border-yellow-500 outline-none"
                      >
                        <option value="">無</option>
                        <option value="gold">金牌 (Gold)</option>
                        <option value="silver">銀牌 (Silver)</option>
                        <option value="bronze">銅牌 (Bronze)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2">6. 網址 (Link)</label>
                      <input 
                        type="text" 
                        value={cnItem.link || ''} 
                        onChange={(e) => handleSharedChange(index, 'link', e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white focus:border-yellow-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {length === 0 && (
            <div className="text-center py-10 text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
              目前沒有項目，請點擊上方按鈕新增。
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-zinc-800 pb-6 gap-4">
          <h1 className="text-3xl font-bold text-yellow-500">管理後台 (CMS)</h1>
          <div className="flex items-center gap-4 bg-zinc-900 py-2 px-4 rounded-full border border-zinc-800">
            <span className="text-zinc-400 text-sm hidden sm:inline">{user.email}</span>
            <button onClick={logout} className="flex items-center gap-2 text-red-400 hover:text-red-300 font-medium">
              <LogOut size={16} /> 登出
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Tabs */}
          <div className="w-full md:w-64 flex flex-row md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
            {[
              { id: 'hero', name: '首頁輪播區 (Hero)' },
              { id: 'history', name: '職業生涯戰績 (Career)' },
              { id: 'services', name: '服務與社群 (Services)' },
              { id: 'others', name: '其他 (Others)' },
              { id: 'sponsors', name: '合作廠商 (Sponsors)' },
              { id: 'footer', name: '頁尾設定 (Footer)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`text-left px-5 py-3 rounded-xl font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' 
                    : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="flex-1 bg-zinc-900 rounded-2xl p-6 md:p-8 border border-zinc-800">
            {activeTab === 'hero' && (
              <div className="animate-fade-in-up">
                <h2 className="text-2xl font-bold mb-6 text-white border-l-4 border-yellow-500 pl-3">首頁區塊設定</h2>
                
                <div className="grid md:grid-cols-2 gap-x-6">
                  <div className="bg-zinc-950 p-5 rounded-xl border border-zinc-800 mb-6">
                    <h3 className="text-yellow-500 font-bold mb-4">中文設定</h3>
                    {renderInputField("副標題", "heroTitleCn")}
                    {renderInputField("引言 (第一行)", "heroQuoteCn")}
                    {renderInputField("引言 (第二行)", "heroSubquoteCn")}
                  </div>
                  
                  <div className="bg-zinc-950 p-5 rounded-xl border border-zinc-800 mb-6">
                    <h3 className="text-yellow-500 font-bold mb-4">英文設定</h3>
                    {renderInputField("Subtitle", "heroTitleEn")}
                    {renderInputField("Quote (Line 1)", "heroQuoteEn")}
                    {renderInputField("Quote (Line 2)", "heroSubquoteEn")}
                  </div>
                </div>

                <div className="bg-zinc-950 p-5 rounded-xl border border-zinc-800">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-yellow-500 font-bold">背景輪播圖片</h3>
                    <label className="cursor-pointer bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg text-sm font-bold inline-flex items-center gap-2 transition-colors">
                      {uploadingImage === 'heroBgImages' ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
                      新增圖片
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'heroBgImages', true)} disabled={!!uploadingImage} />
                    </label>
                  </div>
                  
                  <p className="text-zinc-500 text-sm mb-4">可以上傳多張圖片，系統會自動在首頁進行輪播。也可以直接填入圖片網址。</p>

                  <div className="space-y-4">
                    {siteData.heroBgImages && siteData.heroBgImages.map((img: string, index: number) => (
                      <div key={index} className="flex gap-4 items-start p-4 bg-zinc-900 rounded-lg border border-zinc-800">
                        <div className="w-24 h-24 bg-black rounded flex-shrink-0 border border-zinc-700 overflow-hidden">
                          <img src={img} alt={`BG ${index}`} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <input 
                            type="text" 
                            value={img} 
                            onChange={(e) => {
                              const newImages = [...siteData.heroBgImages];
                              newImages[index] = e.target.value;
                              setSiteData(prev => ({ ...prev, heroBgImages: newImages }));
                            }}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-white focus:border-yellow-500 outline-none text-sm mb-2" 
                          />
                          <div className="flex gap-2">
                            <label className="cursor-pointer bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-1.5 rounded text-xs inline-flex items-center gap-1 transition-colors">
                              {uploadingImage === `heroBgImages-${index}` ? <Loader2 className="animate-spin" size={14} /> : <ImageIcon size={14} />}
                              替換圖片
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'heroBgImages', true, index)} disabled={!!uploadingImage} />
                            </label>
                            <button onClick={() => removeHeroImage(index)} className="bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300 px-3 py-1.5 rounded text-xs inline-flex items-center gap-1 transition-colors">
                              <Trash2 size={14} /> 刪除
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="animate-fade-in-up">
                <h2 className="text-2xl font-bold mb-6 text-white border-l-4 border-yellow-500 pl-3">職業生涯戰績 (Career)</h2>
                {renderCombinedCompetitionEditor()}
              </div>
            )}

            {activeTab === 'services' && (
              renderDynamicListEditor("服務與社群連結 (Services)", "servicesList")
            )}

            {activeTab === 'others' && (
              renderDynamicListEditor("其他 (Others)", "othersList")
            )}

            {activeTab === 'sponsors' && (
              <div className="animate-fade-in-up">
                {renderDynamicListEditor("合作廠商設定 (Sponsors)", "sponsorsList")}
                <div className="mt-8 bg-zinc-950 p-5 rounded-xl border border-zinc-800">
                  <h3 className="text-yellow-500 font-bold mb-4">折扣碼設定 (通用)</h3>
                  {renderInputField("全站專屬折扣碼", "discountCode")}
                </div>
              </div>
            )}

            {activeTab === 'footer' && (
              <div className="animate-fade-in-up">
                <h2 className="text-2xl font-bold mb-6 text-white border-l-4 border-yellow-500 pl-3">頁尾設定 (Footer)</h2>
                <div className="grid md:grid-cols-2 gap-x-6">
                  <div className="bg-zinc-950 p-5 rounded-xl border border-zinc-800 mb-6">
                    <h3 className="text-yellow-500 font-bold mb-4">中文設定</h3>
                    {renderInputField("頁尾大標題", "footerTitleCn")}
                    {renderInputField("版權宣告文字", "footerCopyrightCn")}
                  </div>
                  <div className="bg-zinc-950 p-5 rounded-xl border border-zinc-800 mb-6">
                    <h3 className="text-yellow-500 font-bold mb-4">英文設定</h3>
                    {renderInputField("Footer Title", "footerTitleEn")}
                    {renderInputField("Copyright Text", "footerCopyrightEn")}
                  </div>
                </div>
              </div>
            )}

            {/* Sticky Save Button */}
            <div className="mt-8 pt-6 border-t border-zinc-800 sticky bottom-0 bg-zinc-900 pb-2">
              <button 
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-yellow-500 text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-yellow-400 transition-colors disabled:opacity-50 shadow-xl shadow-yellow-500/10 text-lg"
              >
                {saving ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />}
                {saving ? '儲存同步中...' : '儲存所有變更並更新網站'}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

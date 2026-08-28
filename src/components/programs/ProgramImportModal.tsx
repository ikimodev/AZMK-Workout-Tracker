import React, { useState } from 'react';
import { Program } from '../../types';
import { useWorkout } from '../../context/WorkoutContext';
import { Dumbbell, Download, X, Loader2, Search } from 'lucide-react';

interface ProgramImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImported: () => void;
}

export const ProgramImportModal: React.FC<ProgramImportModalProps> = ({ isOpen, onClose, onImported }) => {
  const { saveGeneratedProgram, language } = useWorkout();
  const [isLoading, setIsLoading] = useState(false);
  const [codeInputValue, setCodeInputValue] = useState('');
  const [fetchedProgram, setFetchedProgram] = useState<Program | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Reset state when opened
  React.useEffect(() => {
    if (isOpen) {
      setCodeInputValue('');
      setFetchedProgram(null);
      setError(null);
    }
  }, [isOpen]);

  const handleFetchProgram = async () => {
    const code = codeInputValue.trim();
    if (!code) {
      setError(language === 'ar' ? 'يرجى إدخال الكود أولاً' : 'Please enter a code first');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      const { supabase } = await import('../../services/supabase');
      const { data, error } = await supabase
        .from('shared_programs')
        .select('program_data')
        .eq('id', code)
        .single();

      if (error || !data) {
        throw new Error(error?.message || 'Program not found');
      }

      setFetchedProgram(data.program_data as Program);
    } catch (err: any) {
      console.error(err);
      setError(language === 'ar' ? 'تعذر العثور على الجدول المطلوب. تأكد من صحة الكود.' : 'Could not find the program. Make sure the code is correct.');
    }
    setIsLoading(false);
  };

  const handleImport = () => {
    if (!fetchedProgram) return;
    
    // Create a new ID to avoid collisions
    const importedProgram: Program = {
      ...fetchedProgram,
      id: `prog_imported_${Date.now()}`,
      name: `${fetchedProgram.name} (Imported)`
    };

    saveGeneratedProgram(importedProgram);
    onImported();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-background-card border border-border rounded-3xl p-6 shadow-2xl animate-scale-in flex flex-col">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 rtl:right-auto rtl:left-4 p-2 bg-background/50 hover:bg-background-elevated rounded-full text-slate-400 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
            <Download className="w-5 h-5 text-blue-400" />
          </div>
          <h2 className="text-xl font-black text-white">
            {language === 'ar' ? 'استيراد جدول تدريبي' : 'Import Program'}
          </h2>
        </div>

        {!fetchedProgram ? (
          <div className="space-y-4">
            <p className="text-sm text-slate-400">
              {language === 'ar' 
                ? 'أدخل الكود القصير الذي شاركه معك صديقك لتحميل الجدول التدريبي.' 
                : 'Enter the short code shared by your friend to load the workout program.'}
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="AZMK-XXXXXX"
                value={codeInputValue}
                onChange={(e) => setCodeInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleFetchProgram()}
                className="flex-1 bg-background-elevated border border-border rounded-xl px-4 py-3 text-white font-mono uppercase focus:outline-none focus:border-blue-500 transition-colors"
                autoFocus
              />
              <button
                onClick={handleFetchProgram}
                disabled={isLoading}
                className="px-4 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 disabled:opacity-50 text-white font-bold flex items-center gap-2 transition-all active:scale-95"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span className="hidden sm:inline">{language === 'ar' ? 'بحث' : 'Search'}</span>
              </button>
            </div>
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-3 text-center">
                <p className="text-red-400 text-sm font-bold">{error}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-background-elevated border border-border rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-white">{fetchedProgram.name}</h3>
                <button 
                  onClick={() => {
                    setFetchedProgram(null);
                    setCodeInputValue('');
                  }}
                  className="text-xs text-slate-400 hover:text-white underline"
                >
                  {language === 'ar' ? 'إدخال كود آخر' : 'Enter another code'}
                </button>
              </div>
              <p className="text-sm text-slate-400 mb-4">{fetchedProgram.description}</p>
              
              <div className="flex flex-wrap gap-2 text-xs font-mono">
                <span className="px-2 py-1 rounded bg-accent-indigo/20 text-accent-indigo">
                  {fetchedProgram.goal}
                </span>
                <span className="px-2 py-1 rounded bg-accent-emerald/20 text-accent-emerald">
                  {fetchedProgram.daysPerWeek} {language === 'ar' ? 'أيام بالاسبوع' : 'days/week'}
                </span>
              </div>
            </div>

            <button
              onClick={handleImport}
              className="w-full py-3.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-extrabold text-sm uppercase tracking-wider shadow-glow-sm transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>{language === 'ar' ? 'استيراد هذا الجدول' : 'Import This Program'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

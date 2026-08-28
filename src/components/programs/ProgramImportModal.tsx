import React, { useState } from 'react';
import { Program } from '../../types';
import { useWorkout } from '../../context/WorkoutContext';
import { Dumbbell, Download, X, Loader2 } from 'lucide-react';

interface ProgramImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  sharedCode: string | null;
  onImported: () => void;
}

export const ProgramImportModal: React.FC<ProgramImportModalProps> = ({ isOpen, onClose, sharedCode, onImported }) => {
  const { saveGeneratedProgram, language } = useWorkout();
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedProgram, setFetchedProgram] = useState<Program | null>(null);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen && sharedCode) {
      fetchProgram(sharedCode);
    }
  }, [isOpen, sharedCode]);

  const fetchProgram = async (code: string) => {
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
      setError(language === 'ar' ? 'تعذر العثور على الجدول المطلوب. تأكد من صحة الرابط.' : 'Could not find the program. Make sure the link is correct.');
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

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10 gap-4">
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
            <p className="text-slate-400 text-sm font-medium">
              {language === 'ar' ? 'جاري البحث عن الجدول...' : 'Fetching program...'}
            </p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-center">
            <p className="text-red-400 text-sm font-bold">{error}</p>
          </div>
        ) : fetchedProgram ? (
          <div className="space-y-6">
            <div className="bg-background-elevated border border-border rounded-2xl p-4">
              <h3 className="text-lg font-bold text-white mb-2">{fetchedProgram.name}</h3>
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
              className="w-full py-3.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-extrabold text-sm uppercase tracking-wider shadow-glow-sm transition-all active:scale-95"
            >
              {language === 'ar' ? 'استيراد هذا الجدول' : 'Import This Program'}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

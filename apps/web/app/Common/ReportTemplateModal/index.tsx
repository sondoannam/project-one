import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import styles from './index.module.scss';

interface ReportTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { title: string; sections: number; subject: string }) => void;
  initialData?: { title: string; sections: number; subject: string } | null;
}

export default function ReportTemplateModal({ isOpen, onClose, onSave, initialData }: ReportTemplateModalProps) {
  const [title, setTitle] = useState('');
  const [sections, setSections] = useState('');
  const [subject, setSubject] = useState('');

  // 🚀 Khi mở modal, nếu có `initialData` thì hiển thị dữ liệu cũ
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setSections(initialData.sections);
      setSubject(initialData.subject);
    } else {
      setTitle('');
      setSections('');
      setSubject('');
    }
  }, [initialData, isOpen]);

  const handleSave = () => {
    onSave({ title, sections, subject });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={styles.modal}>
        <DialogHeader>
          <DialogTitle className={styles.modalTitle}>{initialData ? 'Edit Template' : 'New Template'}</DialogTitle>
        </DialogHeader>

        <div className={styles.modalBody}>
          <label className={styles.label}>Lesson Title</label>
          <Input className={styles.input} value={title} onChange={(e) => setTitle(e.target.value)} />

          <label className={styles.label}>Sections</label>
          <Input className={styles.input} type="number" value={sections} onChange={(e) => setSections(Number(e.target.value))} />

          <label className={styles.label}>Subject</label>
          <Input className={styles.input} value={subject} onChange={(e) => setSubject(e.target.value)} />
        </div>

        <DialogFooter className={styles.modalFooter}>
          <Button onClick={onClose} variant="outline" className={styles.cancelButton}>Cancel</Button>
          <Button onClick={handleSave} className={styles.saveButton}>
            {initialData ? 'Update' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

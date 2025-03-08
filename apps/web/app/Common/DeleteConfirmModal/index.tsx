import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import styles from './index.module.scss';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm }: DeleteConfirmModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={styles.modalContent}>
        <DialogHeader>
          <DialogTitle className={styles.title}>
            This action will delete the template <span className={styles.warning}>permanently</span>.
          </DialogTitle>
        </DialogHeader>

        <DialogFooter className={styles.modalFooter}>
          <Button onClick={onConfirm} className={styles.deleteButton}>Continue</Button>
          <Button onClick={onClose} variant="outline" className={styles.cancelButton}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

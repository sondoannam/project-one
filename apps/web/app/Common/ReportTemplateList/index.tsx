'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil, Trash, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import styles from './index.module.scss';
import ReportTemplateModal from '../ReportTemplateModal';
import DeleteConfirmModal from '../DeleteConfirmModal';

interface Lesson {
  id: number;
  title: string;
  sections: number;
  subject: string;
  createDate: string;
}

export default function ReportTemplateList() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [deleteLessonId, setDeleteLessonId] = useState<number | null>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    const storedLessons = localStorage.getItem('lessons');
    if (storedLessons) {
      setLessons(JSON.parse(storedLessons));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('lessons', JSON.stringify(lessons));
  }, [lessons]);

  const handleSave = (lessonData: { title: string; sections: number; subject: string }) => {
    if (editingLesson) {
      setLessons(lessons.map((lesson) => (lesson.id === editingLesson.id ? { ...lesson, ...lessonData } : lesson)));
    } else {
      const newLesson: Lesson = {
        id: Date.now(),
        createDate: new Date().toLocaleDateString('en-US'),
        ...lessonData,
      };
      setLessons([...lessons, newLesson]);
    }
    setOpenDialog(false);
    setEditingLesson(null);
  };

  const handleEdit = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setOpenDialog(true);
  };

  const handleDeleteClick = (id: number) => {
    setDeleteLessonId(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteLessonId !== null) {
      setLessons(lessons.filter((lesson) => lesson.id !== deleteLessonId));
      setDeleteModalOpen(false);
      setDeleteLessonId(null);
    }
  };

  return (
    <div className={cn(styles.container)}>
      <div className={cn(styles.header)}>
        <h2 className={cn(styles.title)}>Report Template List</h2>
        <Button className={cn(styles.newButton)} onClick={() => setOpenDialog(true)}>
          <Plus size={16} className={cn(styles.icon)} /> New Template
        </Button>
      </div>

      <ReportTemplateModal
        isOpen={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setEditingLesson(null);
        }}
        onSave={handleSave}
        initialData={editingLesson}
      />

      <Table className={cn(styles.table)}>
        <TableHeader>
          <TableRow>
            <TableHead>Lesson Title</TableHead>
            <TableHead>Sections</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Create Date</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lessons.map((lesson) => (
            <TableRow key={lesson.id} className={cn(styles.row)}>
              <TableCell>{lesson.title}</TableCell>
              <TableCell>{lesson.sections}</TableCell>
              <TableCell>{lesson.subject}</TableCell>
              <TableCell>{lesson.createDate}</TableCell>
              <TableCell className={cn(styles.actions)}>
                <Button className={cn(styles.editButton)} onClick={() => handleEdit(lesson)}>
                  <Pencil size={16} />
                  Edit
                </Button>
                <Button onClick={() => handleDeleteClick(lesson.id)} className={cn(styles.deleteButton)}>
                  <Trash size={16} />
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

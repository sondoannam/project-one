'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { LayoutGrid, LayoutList, ScrollText } from 'lucide-react';

import { cn } from '@/lib/utils';
import styles from './index.module.scss';

import Image from 'next/image';

export default function AppSidebar() {
  return (
    <Sidebar className={cn(styles.sidebar)}>
      <SidebarHeader className={cn(styles.header)}>
        <span className={cn(styles.intro)}>
          <Image src='/images/avt.png' alt='Avatar' width={400} height={400} />
          <span className={cn(styles.text)}>
            <p>Good Day</p>
            <h3>Teacher's Name</h3>
          </span>
        </span>
      </SidebarHeader>

      <SidebarContent className={cn(styles.content)}>
        <SidebarGroup className={cn(styles.group)}>
          <Button variant='ghost' className={cn(styles.button)}>
            <LayoutGrid size={18} className={cn(styles.icon)} />
            <span>Dashboard</span>
          </Button>
          <Button variant='ghost' className={cn(styles.button)}>
            <LayoutList size={18} className={cn(styles.icon)} />
            <span>Report Templates</span>
          </Button>
          <Button variant='ghost' className={cn(styles.button)}>
            <ScrollText size={18} className={cn(styles.icon)} />
            <span>Report List</span>
          </Button>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  );
}

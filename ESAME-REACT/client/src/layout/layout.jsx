import { AppShell, Burger, Group, UnstyledButton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from './Layout.module.css';
import ToggleColorScheme from '../components/ToggleColorScheme';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  const [opened, { toggle }] = useDisclosure();

  const routes = [
    { name: "Lista Clienti", path: "/clientlist" },
    { name: "Dettaglio Clienti", path: "/clientdetail" },
    { name: "Lista Libri", path: "/booklist" },
    { name: "Dettaglio Libri", path: "/bookdetail" },
  ]

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { desktop: true, mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Group justify="space-between" style={{ flex: 1 }}>
            Biblioteca
            <Group ml="xl" gap={6} visibleFrom="sm">
              {routes.map(() => (
                <UnstyledButton className={classes.control}></UnstyledButton>
              ))}
            </Group>
          </Group>
          <Group ml="xl" gap={0}>
            <ToggleColorScheme />
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar py="md" px={4}>
        <UnstyledButton className={classes.control}>Home</UnstyledButton>
        <UnstyledButton className={classes.control}>Blog</UnstyledButton>
        <UnstyledButton className={classes.control}>Contacts</UnstyledButton>
        <UnstyledButton className={classes.control}>Support</UnstyledButton>
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet/>
      </AppShell.Main>
    </AppShell>
  );
}
import { AppShell, Burger, Group, Title, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from './Layout.module.css';
import { Link, Outlet } from 'react-router-dom';
import ToggleColorScheme from '../components/ToggleColorScheme';

export default function Layout() {
  const [opened, { toggle }] = useDisclosure();

  const links = [
    { label: "Lista Clienti", link: "/clientlist" },
    { label: "Dettaglio Clienti", link: "/clientdetail" },
    { label: "Lista Libri", link: "/booklist" },
    { label: "Dettaglio Libri", link: "/bookdetail" },
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
            <Title component={Link} to="/">Libreria</Title>
            <Group ml="xl" gap={0} visibleFrom="sm">
              {links.map((link, index) => (
                <Button key={index} component={Link} to={link.link} variant='subtle' className={classes.control}>{link.label}</Button>
              ))}
            </Group>
          </Group>
          <Group>
            <ToggleColorScheme />
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar py="md" px={4}>
        {links.map((link, index) => (
          <Button key={index} component={Link} to={link.link} variant='subtle' className={classes.control}>{link.label}</Button>
        ))}
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet/>
      </AppShell.Main>
    </AppShell>
  );
}
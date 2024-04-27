import { AppShell, Burger, Group, Title, Button, Container } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link, Outlet } from 'react-router-dom';
import ToggleColorScheme from '../components/ToggleColorScheme';
import NavItems from '../components/NavItems';
import { FaBookOpen } from "react-icons/fa6";

export default function Layout() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <Container fluid>
      <AppShell
        header={{ height: 60 }}
        navbar={{ width: 300, breakpoint: 'sm', collapsed: { desktop: true, mobile: !opened } }}
        padding="md"
      >
        <AppShell.Header>
          <Group h="100%" px="md">
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Group justify="space-between" style={{ flex: 1 }}>
              <Group style={{'color': 'inherit', 'text-decoration' : 'none' }} component={Link} to="/">
                <FaBookOpen size={32}/>
                <Title >Libreria</Title>
              </Group>
              <Group ml="xl" gap={0} visibleFrom="sm">
                <NavItems />
              </Group>
            </Group>
            <Group>
              <ToggleColorScheme />
            </Group>
          </Group>
        </AppShell.Header>

        <AppShell.Navbar py="md" px={4}>
          <NavItems />
        </AppShell.Navbar>

        <AppShell.Main>
          {/* TODO Magari mettere la label del link corrente */}
          <Outlet />
        </AppShell.Main>

      </AppShell>
    </Container>
  );
}
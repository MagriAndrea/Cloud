import { useState } from 'react';
import { Container, Group, Burger, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from './Header.module.css';
import ToggleColorScheme from './ToggleColorScheme';

const links = [
    { label: "Lista Clienti", link: "/clientlist" },
    { label: "Dettaglio Clienti", link: "/clientdetail" },
    { label: "Lista Libri", link: "/booklist" },
    { label: "Dettaglio Libri", link: "/bookdetail" },
]

export default function Header() {
    const [opened, { toggle }] = useDisclosure(false);
    const [active, setActive] = useState(links[0].link);

    const items = links.map((link) => (
        <a
            key={link.label}
            href={link.link}
            className={classes.link}
            data-active={active === link.link || undefined}
            onClick={(event) => {
                event.preventDefault();
                setActive(link.link);
            }}
        >
            {link.label}
        </a>
    ));

    return (
        <Group>
            <Group justify="space-between" gap={5} visibleFrom="xs">
                <Text >Biblioteca</Text>
                {items}
                <ToggleColorScheme />
            </Group>
        </Group>
    );
}
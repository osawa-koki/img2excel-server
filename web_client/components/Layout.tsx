import React, { ReactNode } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Setting from '../setting';
import pages from '../common/pages';

type Props = {
  children?: ReactNode,
  title?: string,
}

const Layout = ({ children, title = Setting.title }: Props) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <link rel="shortcut icon" href={`${Setting.basePath}/favicon.ico`} type="image/x-icon" />
    </Head>
    <header>
      <nav>
        {
          pages.map((page, index) => (
            <Link key={index} href={page.path}>
              {page.name}
            </Link>
          ))
        }
      </nav>
    </header>
    <main>
      {children}
    </main>
    <footer>
    </footer>
  </div>
);

export default Layout;

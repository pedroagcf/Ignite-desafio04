import { ReactElement, useEffect, useState } from 'react';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { FiCalendar, FiUser } from 'react-icons/fi';
import * as Prismic from '@prismicio/client';

import { getPrismicClient } from '../services/prismic';
import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

function handleFormatPosts(responsePosts): PostPagination {
  const postsArray: Post[] = responsePosts.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: format(
        new Date(post.first_publication_date),
        `d MMM yyyy`,
        {
          locale: ptBR,
        }
      ),
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  const nextPostsPage: PostPagination = {
    next_page: responsePosts.next_page ?? '',
    results: postsArray,
  };

  return nextPostsPage;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const [posts, setPosts] = useState<PostPagination>();

  async function handlePostPagination(): Promise<void> {
    const prismic = getPrismicClient();
    const responsePosts = await prismic.query(
      [Prismic.Predicates.at('document.type', 'posts')],
      {
        fetch: [''],
        pageSize: 5,
        page: Number(posts.next_page) + 1,
      }
    );

    const nextPostsPage = handleFormatPosts(responsePosts);

    setPosts(nextPostsPage);
  }

  useEffect(() => {
    setPosts({
      ...postsPagination,
    });
  }, [posts, postsPagination]);

  return (
    <>
      <Head>
        <title>Posts | Space Travelling</title>
      </Head>
      <main className={styles.container}>
        {posts?.results.map(post => (
          <Link key={post.uid} href={`/post/${post.uid}`}>
            <a>
              <strong>{post.data.title}</strong>
              <p>{post.data.subtitle}</p>
              <div className={styles.postDetails}>
                <div>
                  <span>
                    <FiCalendar />
                  </span>
                  <time>{post.first_publication_date}</time>
                </div>
                <div>
                  <span>
                    <FiUser />
                  </span>
                  <p>{post.data.author}</p>
                </div>
              </div>
            </a>
          </Link>
        ))}
        <button
          className={`${styles.loadPosts} ${
            postsPagination.next_page ? styles.isActive : ''
          }`}
          onClick={handlePostPagination}
          type="button"
        >
          Carregar mais posts
        </button>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const responsePosts = await prismic.query(
    [Prismic.Predicates.at('document.type', 'posts')],
    {
      fetch: [''],
      pageSize: 5,
    }
  );

  const postsPagination = handleFormatPosts(responsePosts);

  return {
    props: {
      postsPagination,
    },
    revalidate: 60 * 60 * 24, // 24 hours
  };
};

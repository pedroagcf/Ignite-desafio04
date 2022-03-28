import { GetStaticPaths, GetStaticProps } from 'next';
import * as Prismic from '@prismicio/client';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { RichText } from 'prismic-dom';

import Head from 'next/head';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>{post.data.title} | Space Travelling</title>
      </Head>

      {router.isFallback ? (
        <main className={styles.container}>
          <section>
            <h1>Carregando...</h1>
          </section>
        </main>
      ) : (
        <main className={styles.container}>
          <article>
            <figure>
              <img src={post.data.banner.url} alt="banner" />
            </figure>
            <section className={styles.post}>
              <h1>{post.data.title}</h1>
              <div className={styles.infoDetails}>
                <div>
                  <span>
                    <FiCalendar />
                  </span>
                  <time>
                    {format(
                      new Date(post.first_publication_date),
                      `d MMM yyyy`,
                      {
                        locale: ptBR,
                      }
                    )}
                  </time>
                </div>
                <div>
                  <span>
                    <FiUser />
                  </span>
                  <p>{post.data.author}</p>
                </div>
                <div>
                  <span>
                    <FiClock />
                  </span>
                  <p>4 min</p>
                </div>
              </div>
              {post.data.content.map(content => (
                <section key={content.heading} className={styles.postContent}>
                  <h1 className={styles.contentHeading}>{content.heading}</h1>
                  <div
                    className={styles.contentBody}
                    dangerouslySetInnerHTML={{
                      __html: RichText.asHtml(content.body),
                    }}
                  />
                </section>
              ))}
            </section>
          </article>
        </main>
      )}
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();

  const posts = await prismic.query(
    [Prismic.Predicates.at('document.type', 'posts')],
    {}
  );

  const paths = posts.results.map(post => ({
    params: { slug: String(post.uid) },
  }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async context => {
  const { slug } = context.params;
  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', String(slug), {});

  return {
    props: {
      post: response,
    },
    revalidate: 60 * 30,
  };
};

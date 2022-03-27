import { GetStaticPaths, GetStaticProps } from 'next';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { RichText } from 'prismic-dom';

import Head from 'next/head';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';
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
  return (
    <>
      <Head>
        <title>{post.data.title} | Space Travelling</title>
      </Head>
      <main className={styles.container}>
        <article>
          <figure>
            <img src={post.data.banner.url} alt="banner" />
          </figure>
          <section className={styles.content}>
            <h1>{post.data.title}</h1>
            <div className={styles.infoDetails}>
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
              <div>
                <span>
                  <FiClock />
                </span>
                <p>4 min</p>
              </div>
            </div>
            <div
              className={styles.contentHeading}
              dangerouslySetInnerHTML={{ __html: post.data.content.heading }}
            />
            <div
              className={styles.contentBody}
              dangerouslySetInnerHTML={{ __html: post.data.content.body.text }}
            />
          </section>
        </article>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  // const prismic = getPrismicClient();
  // const posts = await prismic.query(TODO);
  // TODO
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async context => {
  const { slug } = context.params;
  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', String(slug), {});

  const post = {
    first_publication_date: format(
      new Date(response.first_publication_date),
      `d MMM yyyy`,
      {
        locale: ptBR,
      }
    ),
    data: {
      title: response.data.title,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: {
        heading: response.data.content[0].heading,
        // RichText.asHtml(response.data.content[0].heading),
        body: {
          text: RichText.asHtml(response.data.content[0].body),
        },
      },
    },
  };

  return {
    props: {
      post,
    },
    revalidate: 60 * 30,
  };
};

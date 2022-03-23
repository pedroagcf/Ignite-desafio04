import * as Prismic from '@prismicio/client';
import sm from '../../sm.json';

const routes = [
  {
    type: 'posts',
    path: '/posts',
  },
];

export function getPrismicClient(req?: unknown): Prismic.Client {
  const accessToken = process.env.PRISMIC_ACCESS_TOKEN;
  const endpoint = sm.apiEndpoint;
  const repositoryName = Prismic.getRepositoryName(endpoint);

  const endPoint = Prismic.getEndpoint(repositoryName);
  const prismic = Prismic.createClient(endPoint, {
    routes,
    fetch,
    accessToken,
  });

  // client.query()

  // const prismic = Prismic.client(process.env.PRISMIC_API_ENDPOINT, {
  //   req,
  // });

  return prismic;
}

import * as Prismic from '@prismicio/client';
import sm from '../../sm.json';

const routes = [
  {
    type: 'posts',
    path: '/posts',
  },
];

export function getPrismicClient(req?: unknown): Prismic.Client {
  const endpoint = sm.apiEndpoint;
  const repositoryName = Prismic.getRepositoryName(endpoint);

  const endPoint = Prismic.getEndpoint(repositoryName);
  const prismic = Prismic.createClient(endPoint, {
    routes,
    fetch,
  });

  return prismic;
}

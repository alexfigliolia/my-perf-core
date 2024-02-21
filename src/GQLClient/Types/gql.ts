/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  mutation pullGithubRepositories(\n    $id: Int!\n    $name: String!\n    $platform: Platform!\n    $type: InstallationType!\n    $token: String!\n  ) {\n    pullGithubRepositories(\n      id: $id\n      name: $name\n      platform: $platform\n      type: $type\n      token: $token\n    ) {\n      jobId\n      status\n      repos {\n        id\n        name\n        description\n        html_url\n        clone_url\n        language\n        platform\n        url\n      }\n    }\n  }\n": types.PullGithubRepositoriesDocument,
    "\n  mutation resumeGithubPull($id: Int!, $token: String!) {\n    resumeGithubPull(id: $id, token: $token) {\n      jobId\n      status\n      repos {\n        id\n        name\n        description\n        html_url\n        clone_url\n        language\n        platform\n        url\n      }\n    }\n  }\n": types.ResumeGithubPullDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation pullGithubRepositories(\n    $id: Int!\n    $name: String!\n    $platform: Platform!\n    $type: InstallationType!\n    $token: String!\n  ) {\n    pullGithubRepositories(\n      id: $id\n      name: $name\n      platform: $platform\n      type: $type\n      token: $token\n    ) {\n      jobId\n      status\n      repos {\n        id\n        name\n        description\n        html_url\n        clone_url\n        language\n        platform\n        url\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation pullGithubRepositories(\n    $id: Int!\n    $name: String!\n    $platform: Platform!\n    $type: InstallationType!\n    $token: String!\n  ) {\n    pullGithubRepositories(\n      id: $id\n      name: $name\n      platform: $platform\n      type: $type\n      token: $token\n    ) {\n      jobId\n      status\n      repos {\n        id\n        name\n        description\n        html_url\n        clone_url\n        language\n        platform\n        url\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation resumeGithubPull($id: Int!, $token: String!) {\n    resumeGithubPull(id: $id, token: $token) {\n      jobId\n      status\n      repos {\n        id\n        name\n        description\n        html_url\n        clone_url\n        language\n        platform\n        url\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation resumeGithubPull($id: Int!, $token: String!) {\n    resumeGithubPull(id: $id, token: $token) {\n      jobId\n      status\n      repos {\n        id\n        name\n        description\n        html_url\n        clone_url\n        language\n        platform\n        url\n      }\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;
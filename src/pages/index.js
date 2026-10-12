import { lazy } from 'react';

/* Public pages — each loads as its own chunk. */
export const Home = lazy(() => import('./Home'));
export const HajjPackages = lazy(() => import('./HajjPackages'));
export const UmrahPackages = lazy(() => import('./UmrahPackages'));
export const PackageDetail = lazy(() => import('./PackageDetail'));
export const Services = lazy(() => import('./Services'));
export const About = lazy(() => import('./About'));
export const Contact = lazy(() => import('./Contact'));
export const Register = lazy(() => import('./Register'));
export const Track = lazy(() => import('./Track'));
export const Toolkit = lazy(() => import('./Toolkit'));
export const Overseas = lazy(() => import('./Overseas'));
export const Legal = lazy(() => import('./Legal'));
export const NotFound = lazy(() => import('./NotFound'));

/* Management portal — only requested after the secret key is verified. */
export const PortalApp = lazy(() => import('./portal/PortalApp'));

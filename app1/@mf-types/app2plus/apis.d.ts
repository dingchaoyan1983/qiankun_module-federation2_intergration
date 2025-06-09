
    export type RemoteKeys = 'app2plus/Button';
    type PackageType<T> = T extends 'app2plus/Button' ? typeof import('app2plus/Button') :any;
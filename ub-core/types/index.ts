// types/index.ts
export interface Service {
    id?: string;
    name: string;
    prefix: string;
    port: string;
    isActive: boolean;
}

export interface Route {
    id?: string;
    service: string;
    name: string;
    route: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    dependencies: string;
    definition: string;
    isActive: boolean;
}
  
export interface Procedure {
    id?: string;
    name: string;
    dependencies: string;
    definition: string;
    isActive: boolean;
}

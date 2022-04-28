export interface Medium {
  name: string;
  config: Record<string, any>;
  send: (message: string, userId: string) => Promise<boolean>;
  validateTarget: (userId: string) => boolean;
}
export interface MediumConfig {
  enabled?: boolean;
  retries?: number;
  timeout?: number;
  retryInterval?: number;
  class: typeof Medium;
  config: Record<string, any>;
}

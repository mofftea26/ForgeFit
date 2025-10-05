// src/types/expo-image-manipulator.d.ts
declare module "expo-image-manipulator" {
  export type FlipType = "vertical" | "horizontal";
  export type SaveFormat = "jpeg" | "png" | "webp";

  export interface SaveOptions {
    compress?: number; // 0..1
    format?: SaveFormat; // output format
    base64?: boolean; // include base64 in the result
  }

  export class ImageRef {
    readonly width: number;
    readonly height: number;
    readonly nativeRefType: string;
    saveAsync(options?: SaveOptions): Promise<{ uri: string; base64?: string }>;
  }

  export class ImageManipulatorContext {
    crop(rect: {
      originX: number;
      originY: number;
      width: number;
      height: number;
    }): ImageManipulatorContext;
    extent(opts: {
      backgroundColor: string | null;
      originX: number;
      originY: number;
      width: number;
      height: number;
    }): ImageManipulatorContext;
    flip(flipType: FlipType): ImageManipulatorContext;
    resize(size: {
      width: number | null;
      height: number | null;
    }): ImageManipulatorContext;
    rotate(degrees: number): ImageManipulatorContext;
    reset(): ImageManipulatorContext;
    renderAsync(): Promise<ImageRef>;
  }

  // New contextual API entrypoint
  export function manipulate(source: string): ImageManipulatorContext;

  // (Legacy) still exported by the package; ok to keep typings if you use it elsewhere
  export function manipulateAsync(
    uri: string,
    actions: any[],
    options?: {
      compress?: number;
      format?: SaveFormat | string;
      base64?: boolean;
    }
  ): Promise<{ uri: string; base64?: string }>;
}

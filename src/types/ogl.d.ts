declare module 'ogl' {
  export class Renderer {
    constructor(options?: any);
    gl: WebGLRenderingContext & { canvas: HTMLCanvasElement };
    setSize(width: number, height: number): void;
    render(config: any): void;
  }

  export class Program {
    constructor(gl: WebGLRenderingContext, config: any);
    uniforms: Record<string, { value: any }>;
  }

  export class Mesh {
    constructor(gl: WebGLRenderingContext, config: any);
  }

  export class Triangle {
    constructor(gl: WebGLRenderingContext);
  }

  export class Color {
    constructor(r?: number, g?: number, b?: number);
  }
}

import '@emotion/react';

declare module '@emotion/react' {
  export interface Theme {
    colors: {
      primary: string;
      secondary: string;
      tertiary: string;
      black: string;
      white: string;
      gray: string;
      lightGray: string;
      dartGray: string;
      success: string;
      error: string;
    };
  }
}

# Themes

Example available on Stackblitz and Github

1. Use the mat.theme mixin.
2. Paste the tokens in a file, say tokens.scss. Make sure to adjust the :root, :host selector as needed.
3. Add path/to/tokens.scss in your angular.json's styles array, after Angular Material's theme file.
4. Simply add .dark to html or body element to apply dark theme.
5. Get required fonts from Google Fonts

Angular Material versions: 19/20/21
Type: scss

1. Theme: dark_ocean

```scss
/* These tokens are generated using https://themes.angular-material.dev/ */
/* Preview: https://themes.angular-material.dev/?bold-font-weight=700&brand-font-family=Roboto&medium-font-weight=500&plain-font-family=Roboto&regular-font-weight=400&seed-error=%23ffb4ab&seed-neutral=%2378767c&seed-neutral-variant=%23787581&seed-primary=%233e377f&seed-secondary=%23c7c2e6&seed-tertiary=%23fdade9 */
/* Seed Colors: primary: #3e377f, secondary: #c7c2e6, tertiary: #fdade9, error: #ffb4ab, neutral: #78767c, neutral-variant: #787581 */
/* Seed Typography: plain-font-family: Roboto, brand-font-family: Roboto, bold-font-weight: 700, medium-font-weight: 500, regular-font-weight: 400 */

/* Make sure to import fonts in `<head>` of html */
/*
<style>
  @import url('https://fonts.googleapis.com/css2?family=Roboto&family=Roboto&display=swap');
</style>

OR

<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto&family=Roboto&display=swap">
*/

@use "@angular/material" as mat;


/* Light Theme */
:root, :host {
  @include mat.theme-overrides((
    primary: #5c559f,
    on-primary: #ffffff,
    primary-container: #e4dfff,
    on-primary-container: #170b58,
    inverse-primary: #c6bfff,
    primary-fixed: #e4dfff,
    primary-fixed-dim: #c6bfff,
    on-primary-fixed: #170b58,
    on-primary-fixed-variant: #443d85,
    secondary: #5e5b7a,
    on-secondary: #ffffff,
    secondary-container: #e4dfff,
    on-secondary-container: #1b1833,
    secondary-fixed: #e4dfff,
    secondary-fixed-dim: #c7c2e6,
    on-secondary-fixed: #1b1833,
    on-secondary-fixed-variant: #464361,
    tertiary: #89477c,
    on-tertiary: #ffffff,
    tertiary-container: #ffd7f1,
    on-tertiary-container: #390034,
    tertiary-fixed: #ffd7f1,
    tertiary-fixed-dim: #fdade9,
    on-tertiary-fixed: #390034,
    on-tertiary-fixed-variant: #6e2f63,
    background: #fdf8f8,
    on-background: #1c1b1c,
    surface: #fdf8f8,
    surface-dim: #ddd9d9,
    surface-bright: #fdf8f8,
    surface-container-lowest: #ffffff,
    surface-container-low: #f7f3f3,
    surface-container: #f1eded,
    surface-container-high: #ebe7e7,
    surface-container-highest: #e5e1e2,
    on-surface: #1c1b1c,
    shadow: #000000,
    scrim: #000000,
    surface-tint: #5f5d63,
    inverse-surface: #313030,
    inverse-on-surface: #f4f0f0,
    outline: #78767b,
    outline-variant: #c9c5cc,
    neutral: #787676,
    neutral10: #1c1b1c,
    error: #ba1a1a,
    error-container: #ffdad6,
    on-error: #ffffff,
    on-error-container: #410002,
    surface-variant: #e5e1e8,
    on-surface-variant: #48464b,
    neutral-variant: #79767c,
    neutral-variant20: #313035,
    inverse-secondary: #c7c2e6,
    inverse-tertiary: #fdade9,
  ));
}

/* Dark Theme */
.dark {
  @include mat.theme-overrides((
    primary: #c6bfff,
    on-primary: #2d256d,
    primary-container: #443d85,
    on-primary-container: #e4dfff,
    inverse-primary: #5c559f,
    primary-fixed: #e4dfff,
    primary-fixed-dim: #c6bfff,
    on-primary-fixed: #170b58,
    on-primary-fixed-variant: #443d85,
    secondary: #c7c2e6,
    on-secondary: #302d49,
    secondary-container: #464361,
    on-secondary-container: #e4dfff,
    secondary-fixed: #e4dfff,
    secondary-fixed-dim: #c7c2e6,
    on-secondary-fixed: #1b1833,
    on-secondary-fixed-variant: #464361,
    tertiary: #fdade9,
    on-tertiary: #53184b,
    tertiary-container: #6e2f63,
    on-tertiary-container: #ffd7f1,
    tertiary-fixed: #ffd7f1,
    tertiary-fixed-dim: #fdade9,
    on-tertiary-fixed: #390034,
    on-tertiary-fixed-variant: #6e2f63,
    background: #141314,
    on-background: #e5e1e2,
    surface: #141314,
    surface-dim: #141314,
    surface-bright: #3a3939,
    surface-container-lowest: #0e0e0e,
    surface-container-low: #1c1b1c,
    surface-container: #201f20,
    surface-container-high: #2b2a2a,
    surface-container-highest: #353435,
    on-surface: #e5e1e2,
    shadow: #000000,
    scrim: #000000,
    surface-tint: #c8c5cc,
    inverse-surface: #e5e1e2,
    inverse-on-surface: #313030,
    outline: #929095,
    outline-variant: #48464b,
    neutral: #787676,
    neutral10: #1c1b1c,
    error: #ffb4ab,
    error-container: #93000a,
    on-error: #690005,
    on-error-container: #ffdad6,
    surface-variant: #48464b,
    on-surface-variant: #c9c5cc,
    neutral-variant: #79767c,
    neutral-variant20: #313035,
    inverse-secondary: #5e5b7a,
    inverse-tertiary: #89477c,
  ));
}

/* Typography */
:root, :host {
  /* core typography tokens are not generating css variables, hence below */
  --mat-sys-brand-font-family: Roboto;
  --mat-sys-plain-font-family: Roboto;
  --mat-sys-bold-font-weight: 700;
  --mat-sys-medium-font-weight: 500;
  --mat-sys-regular-font-weight: 400;

  @include mat.theme-overrides((
    brand-family: Roboto,
    plain-family: Roboto,
    bold-weight: 700,
    medium-weight: 500,
    regular-weight: 400,
  ));
}
```

2. Theme: light_ocean

```scss
/* These tokens are generated using https://themes.angular-material.dev/ */
/* Preview: https://themes.angular-material.dev/?bold-font-weight=700&brand-font-family=Roboto&medium-font-weight=500&plain-font-family=Roboto&regular-font-weight=400&seed-error=%23ffb4ab&seed-neutral=%2378767c&seed-neutral-variant=%23787581&seed-primary=%233e377f&seed-secondary=%23c7c2e6&seed-tertiary=%23fdade9 */
/* Seed Colors: primary: #3e377f, secondary: #c7c2e6, tertiary: #fdade9, error: #ffb4ab, neutral: #78767c, neutral-variant: #787581 */
/* Seed Typography: plain-font-family: Roboto, brand-font-family: Roboto, bold-font-weight: 700, medium-font-weight: 500, regular-font-weight: 400 */

/* Make sure to import fonts in `<head>` of html */
/*
<style>
  @import url('https://fonts.googleapis.com/css2?family=Roboto&family=Roboto&display=swap');
</style>

OR

<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto&family=Roboto&display=swap">
*/

@use "@angular/material" as mat;


/* Light Theme */
:root, :host {
  @include mat.theme-overrides((
    primary: #5c559f,
    on-primary: #ffffff,
    primary-container: #e4dfff,
    on-primary-container: #170b58,
    inverse-primary: #c6bfff,
    primary-fixed: #e4dfff,
    primary-fixed-dim: #c6bfff,
    on-primary-fixed: #170b58,
    on-primary-fixed-variant: #443d85,
    secondary: #5e5b7a,
    on-secondary: #ffffff,
    secondary-container: #e4dfff,
    on-secondary-container: #1b1833,
    secondary-fixed: #e4dfff,
    secondary-fixed-dim: #c7c2e6,
    on-secondary-fixed: #1b1833,
    on-secondary-fixed-variant: #464361,
    tertiary: #89477c,
    on-tertiary: #ffffff,
    tertiary-container: #ffd7f1,
    on-tertiary-container: #390034,
    tertiary-fixed: #ffd7f1,
    tertiary-fixed-dim: #fdade9,
    on-tertiary-fixed: #390034,
    on-tertiary-fixed-variant: #6e2f63,
    background: #fdf8f8,
    on-background: #1c1b1c,
    surface: #fdf8f8,
    surface-dim: #ddd9d9,
    surface-bright: #fdf8f8,
    surface-container-lowest: #ffffff,
    surface-container-low: #f7f3f3,
    surface-container: #f1eded,
    surface-container-high: #ebe7e7,
    surface-container-highest: #e5e1e2,
    on-surface: #1c1b1c,
    shadow: #000000,
    scrim: #000000,
    surface-tint: #5f5d63,
    inverse-surface: #313030,
    inverse-on-surface: #f4f0f0,
    outline: #78767b,
    outline-variant: #c9c5cc,
    neutral: #787676,
    neutral10: #1c1b1c,
    error: #ba1a1a,
    error-container: #ffdad6,
    on-error: #ffffff,
    on-error-container: #410002,
    surface-variant: #e5e1e8,
    on-surface-variant: #48464b,
    neutral-variant: #79767c,
    neutral-variant20: #313035,
    inverse-secondary: #c7c2e6,
    inverse-tertiary: #fdade9,
  ));
}

/* Dark Theme */
.dark {
  @include mat.theme-overrides((
    primary: #c6bfff,
    on-primary: #2d256d,
    primary-container: #443d85,
    on-primary-container: #e4dfff,
    inverse-primary: #5c559f,
    primary-fixed: #e4dfff,
    primary-fixed-dim: #c6bfff,
    on-primary-fixed: #170b58,
    on-primary-fixed-variant: #443d85,
    secondary: #c7c2e6,
    on-secondary: #302d49,
    secondary-container: #464361,
    on-secondary-container: #e4dfff,
    secondary-fixed: #e4dfff,
    secondary-fixed-dim: #c7c2e6,
    on-secondary-fixed: #1b1833,
    on-secondary-fixed-variant: #464361,
    tertiary: #fdade9,
    on-tertiary: #53184b,
    tertiary-container: #6e2f63,
    on-tertiary-container: #ffd7f1,
    tertiary-fixed: #ffd7f1,
    tertiary-fixed-dim: #fdade9,
    on-tertiary-fixed: #390034,
    on-tertiary-fixed-variant: #6e2f63,
    background: #141314,
    on-background: #e5e1e2,
    surface: #141314,
    surface-dim: #141314,
    surface-bright: #3a3939,
    surface-container-lowest: #0e0e0e,
    surface-container-low: #1c1b1c,
    surface-container: #201f20,
    surface-container-high: #2b2a2a,
    surface-container-highest: #353435,
    on-surface: #e5e1e2,
    shadow: #000000,
    scrim: #000000,
    surface-tint: #c8c5cc,
    inverse-surface: #e5e1e2,
    inverse-on-surface: #313030,
    outline: #929095,
    outline-variant: #48464b,
    neutral: #787676,
    neutral10: #1c1b1c,
    error: #ffb4ab,
    error-container: #93000a,
    on-error: #690005,
    on-error-container: #ffdad6,
    surface-variant: #48464b,
    on-surface-variant: #c9c5cc,
    neutral-variant: #79767c,
    neutral-variant20: #313035,
    inverse-secondary: #5e5b7a,
    inverse-tertiary: #89477c,
  ));
}

/* Typography */
:root, :host {
  /* core typography tokens are not generating css variables, hence below */
  --mat-sys-brand-font-family: Roboto;
  --mat-sys-plain-font-family: Roboto;
  --mat-sys-bold-font-weight: 700;
  --mat-sys-medium-font-weight: 500;
  --mat-sys-regular-font-weight: 400;

  @include mat.theme-overrides((
    brand-family: Roboto,
    plain-family: Roboto,
    bold-weight: 700,
    medium-weight: 500,
    regular-weight: 400,
  ));
}
```

3. Theme: dark_love

```scss
/* These tokens are generated using https://themes.angular-material.dev/ */
/* Preview: https://themes.angular-material.dev/?bold-font-weight=700&brand-font-family=Roboto&medium-font-weight=500&plain-font-family=Roboto&regular-font-weight=400&seed-error=%23ba1a1a&seed-neutral=%2381737a&seed-neutral-variant=%2386717c&seed-primary=%23bb469b&seed-secondary=%23824d70&seed-tertiary=%23ac322f */
/* Seed Colors: primary: #bb469b, secondary: #824d70, tertiary: #ac322f, error: #ba1a1a, neutral: #81737a, neutral-variant: #86717c */
/* Seed Typography: plain-font-family: Roboto, brand-font-family: Roboto, bold-font-weight: 700, medium-font-weight: 500, regular-font-weight: 400 */

/* Make sure to import fonts in `<head>` of html */
/*
<style>
  @import url('https://fonts.googleapis.com/css2?family=Roboto&family=Roboto&display=swap');
</style>

OR

<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto&family=Roboto&display=swap">
*/

@use "@angular/material" as mat;


/* Light Theme */
:root, :host {
  @include mat.theme-overrides((
    primary: #a12f84,
    on-primary: #ffffff,
    primary-container: #ffd8ed,
    on-primary-container: #3b002e,
    inverse-primary: #ffade0,
    primary-fixed: #ffd8ed,
    primary-fixed-dim: #ffade0,
    on-primary-fixed: #3b002e,
    on-primary-fixed-variant: #83106a,
    secondary: #824d70,
    on-secondary: #ffffff,
    secondary-container: #ffd8ed,
    on-secondary-container: #350a2a,
    secondary-fixed: #ffd8ed,
    secondary-fixed-dim: #f5b3db,
    on-secondary-fixed: #350a2a,
    on-secondary-fixed-variant: #673658,
    tertiary: #ac322f,
    on-tertiary: #ffffff,
    tertiary-container: #ffdad6,
    on-tertiary-container: #410003,
    tertiary-fixed: #ffdad6,
    tertiary-fixed-dim: #ffb3ad,
    on-tertiary-fixed: #410003,
    on-tertiary-fixed-variant: #8b191a,
    background: #fef8f8,
    on-background: #1d1b1c,
    surface: #fef8f8,
    surface-dim: #ded9d9,
    surface-bright: #fef8f8,
    surface-container-lowest: #ffffff,
    surface-container-low: #f8f2f2,
    surface-container: #f2eded,
    surface-container-high: #ece7e7,
    surface-container-highest: #e6e1e1,
    on-surface: #1d1b1c,
    shadow: #000000,
    scrim: #000000,
    surface-tint: #685b62,
    inverse-surface: #323030,
    inverse-on-surface: #f5efef,
    outline: #7e7578,
    outline-variant: #d0c3c8,
    neutral: #797676,
    neutral10: #1d1b1c,
    error: #ba1a1a,
    error-container: #ffdad6,
    on-error: #ffffff,
    on-error-container: #410002,
    surface-variant: #ecdfe4,
    on-surface-variant: #4d4448,
    neutral-variant: #7e7478,
    neutral-variant20: #362e32,
    inverse-secondary: #f5b3db,
    inverse-tertiary: #ffb3ad,
  ));
}

/* Dark Theme */
.dark {
  @include mat.theme-overrides((
    primary: #ffade0,
    on-primary: #5f004d,
    primary-container: #83106a,
    on-primary-container: #ffd8ed,
    inverse-primary: #a12f84,
    primary-fixed: #ffd8ed,
    primary-fixed-dim: #ffade0,
    on-primary-fixed: #3b002e,
    on-primary-fixed-variant: #83106a,
    secondary: #f5b3db,
    on-secondary: #4e2040,
    secondary-container: #673658,
    on-secondary-container: #ffd8ed,
    secondary-fixed: #ffd8ed,
    secondary-fixed-dim: #f5b3db,
    on-secondary-fixed: #350a2a,
    on-secondary-fixed-variant: #673658,
    tertiary: #ffb3ad,
    on-tertiary: #680008,
    tertiary-container: #8b191a,
    on-tertiary-container: #ffdad6,
    tertiary-fixed: #ffdad6,
    tertiary-fixed-dim: #ffb3ad,
    on-tertiary-fixed: #410003,
    on-tertiary-fixed-variant: #8b191a,
    background: #141313,
    on-background: #e6e1e1,
    surface: #141313,
    surface-dim: #141313,
    surface-bright: #3b3939,
    surface-container-lowest: #0f0e0e,
    surface-container-low: #1d1b1c,
    surface-container: #211f20,
    surface-container-high: #2b292a,
    surface-container-highest: #363435,
    on-surface: #e6e1e1,
    shadow: #000000,
    scrim: #000000,
    surface-tint: #d3c2ca,
    inverse-surface: #e6e1e1,
    inverse-on-surface: #323030,
    outline: #988e92,
    outline-variant: #4d4448,
    neutral: #797676,
    neutral10: #1d1b1c,
    error: #ffb4ab,
    error-container: #93000a,
    on-error: #690005,
    on-error-container: #ffdad6,
    surface-variant: #4d4448,
    on-surface-variant: #d0c3c8,
    neutral-variant: #7e7478,
    neutral-variant20: #362e32,
    inverse-secondary: #824d70,
    inverse-tertiary: #ac322f,
  ));
}

/* Typography */
:root, :host {
  /* core typography tokens are not generating css variables, hence below */
  --mat-sys-brand-font-family: Roboto;
  --mat-sys-plain-font-family: Roboto;
  --mat-sys-bold-font-weight: 700;
  --mat-sys-medium-font-weight: 500;
  --mat-sys-regular-font-weight: 400;

  @include mat.theme-overrides((
    brand-family: Roboto,
    plain-family: Roboto,
    bold-weight: 700,
    medium-weight: 500,
    regular-weight: 400,
  ));
}
```

4. Theme: light_love

```scss
/* These tokens are generated using https://themes.angular-material.dev/ */
/* Preview: https://themes.angular-material.dev/?bold-font-weight=700&brand-font-family=Roboto&medium-font-weight=500&plain-font-family=Roboto&regular-font-weight=400&seed-error=%23ba1a1a&seed-neutral=%2381737a&seed-neutral-variant=%2386717c&seed-primary=%23bb469b&seed-secondary=%23824d70&seed-tertiary=%23ac322f */
/* Seed Colors: primary: #bb469b, secondary: #824d70, tertiary: #ac322f, error: #ba1a1a, neutral: #81737a, neutral-variant: #86717c */
/* Seed Typography: plain-font-family: Roboto, brand-font-family: Roboto, bold-font-weight: 700, medium-font-weight: 500, regular-font-weight: 400 */

/* Make sure to import fonts in `<head>` of html */
/*
<style>
  @import url('https://fonts.googleapis.com/css2?family=Roboto&family=Roboto&display=swap');
</style>

OR

<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto&family=Roboto&display=swap">
*/

@use "@angular/material" as mat;


/* Light Theme */
:root, :host {
  @include mat.theme-overrides((
    primary: #a12f84,
    on-primary: #ffffff,
    primary-container: #ffd8ed,
    on-primary-container: #3b002e,
    inverse-primary: #ffade0,
    primary-fixed: #ffd8ed,
    primary-fixed-dim: #ffade0,
    on-primary-fixed: #3b002e,
    on-primary-fixed-variant: #83106a,
    secondary: #824d70,
    on-secondary: #ffffff,
    secondary-container: #ffd8ed,
    on-secondary-container: #350a2a,
    secondary-fixed: #ffd8ed,
    secondary-fixed-dim: #f5b3db,
    on-secondary-fixed: #350a2a,
    on-secondary-fixed-variant: #673658,
    tertiary: #ac322f,
    on-tertiary: #ffffff,
    tertiary-container: #ffdad6,
    on-tertiary-container: #410003,
    tertiary-fixed: #ffdad6,
    tertiary-fixed-dim: #ffb3ad,
    on-tertiary-fixed: #410003,
    on-tertiary-fixed-variant: #8b191a,
    background: #fef8f8,
    on-background: #1d1b1c,
    surface: #fef8f8,
    surface-dim: #ded9d9,
    surface-bright: #fef8f8,
    surface-container-lowest: #ffffff,
    surface-container-low: #f8f2f2,
    surface-container: #f2eded,
    surface-container-high: #ece7e7,
    surface-container-highest: #e6e1e1,
    on-surface: #1d1b1c,
    shadow: #000000,
    scrim: #000000,
    surface-tint: #685b62,
    inverse-surface: #323030,
    inverse-on-surface: #f5efef,
    outline: #7e7578,
    outline-variant: #d0c3c8,
    neutral: #797676,
    neutral10: #1d1b1c,
    error: #ba1a1a,
    error-container: #ffdad6,
    on-error: #ffffff,
    on-error-container: #410002,
    surface-variant: #ecdfe4,
    on-surface-variant: #4d4448,
    neutral-variant: #7e7478,
    neutral-variant20: #362e32,
    inverse-secondary: #f5b3db,
    inverse-tertiary: #ffb3ad,
  ));
}

/* Dark Theme */
.dark {
  @include mat.theme-overrides((
    primary: #ffade0,
    on-primary: #5f004d,
    primary-container: #83106a,
    on-primary-container: #ffd8ed,
    inverse-primary: #a12f84,
    primary-fixed: #ffd8ed,
    primary-fixed-dim: #ffade0,
    on-primary-fixed: #3b002e,
    on-primary-fixed-variant: #83106a,
    secondary: #f5b3db,
    on-secondary: #4e2040,
    secondary-container: #673658,
    on-secondary-container: #ffd8ed,
    secondary-fixed: #ffd8ed,
    secondary-fixed-dim: #f5b3db,
    on-secondary-fixed: #350a2a,
    on-secondary-fixed-variant: #673658,
    tertiary: #ffb3ad,
    on-tertiary: #680008,
    tertiary-container: #8b191a,
    on-tertiary-container: #ffdad6,
    tertiary-fixed: #ffdad6,
    tertiary-fixed-dim: #ffb3ad,
    on-tertiary-fixed: #410003,
    on-tertiary-fixed-variant: #8b191a,
    background: #141313,
    on-background: #e6e1e1,
    surface: #141313,
    surface-dim: #141313,
    surface-bright: #3b3939,
    surface-container-lowest: #0f0e0e,
    surface-container-low: #1d1b1c,
    surface-container: #211f20,
    surface-container-high: #2b292a,
    surface-container-highest: #363435,
    on-surface: #e6e1e1,
    shadow: #000000,
    scrim: #000000,
    surface-tint: #d3c2ca,
    inverse-surface: #e6e1e1,
    inverse-on-surface: #323030,
    outline: #988e92,
    outline-variant: #4d4448,
    neutral: #797676,
    neutral10: #1d1b1c,
    error: #ffb4ab,
    error-container: #93000a,
    on-error: #690005,
    on-error-container: #ffdad6,
    surface-variant: #4d4448,
    on-surface-variant: #d0c3c8,
    neutral-variant: #7e7478,
    neutral-variant20: #362e32,
    inverse-secondary: #824d70,
    inverse-tertiary: #ac322f,
  ));
}

/* Typography */
:root, :host {
  /* core typography tokens are not generating css variables, hence below */
  --mat-sys-brand-font-family: Roboto;
  --mat-sys-plain-font-family: Roboto;
  --mat-sys-bold-font-weight: 700;
  --mat-sys-medium-font-weight: 500;
  --mat-sys-regular-font-weight: 400;

  @include mat.theme-overrides((
    brand-family: Roboto,
    plain-family: Roboto,
    bold-weight: 700,
    medium-weight: 500,
    regular-weight: 400,
  ));
}
```

5. Theme: light_snow
```scss
/* These tokens are generated using https://themes.angular-material.dev/ */
/* Preview: https://themes.angular-material.dev/?bold-font-weight=700&brand-font-family=Roboto&medium-font-weight=500&plain-font-family=Roboto&regular-font-weight=400&seed-error=%23ba1a1a&seed-neutral=%2375777d&seed-neutral-variant=%23727783&seed-primary=%235494e7&seed-secondary=%234a5f80&seed-tertiary=%23864396 */
/* Seed Colors: primary: #5494e7, secondary: #4a5f80, tertiary: #864396, error: #ba1a1a, neutral: #75777d, neutral-variant: #727783 */
/* Seed Typography: plain-font-family: Roboto, brand-font-family: Roboto, bold-font-weight: 700, medium-font-weight: 500, regular-font-weight: 400 */

/* Make sure to import fonts in `<head>` of html */
/*
<style>
  @import url('https://fonts.googleapis.com/css2?family=Roboto&family=Roboto&display=swap');
</style>

OR

<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto&family=Roboto&display=swap">
*/

@use "@angular/material" as mat;


/* Light Theme */
:root, :host {
  @include mat.theme-overrides((
    primary: #035faf,
    on-primary: #ffffff,
    primary-container: #d4e3ff,
    on-primary-container: #001c3a,
    inverse-primary: #a5c8ff,
    primary-fixed: #d4e3ff,
    primary-fixed-dim: #a5c8ff,
    on-primary-fixed: #001c3a,
    on-primary-fixed-variant: #004786,
    secondary: #4a5f80,
    on-secondary: #ffffff,
    secondary-container: #d5e3ff,
    on-secondary-container: #021c39,
    secondary-fixed: #d5e3ff,
    secondary-fixed-dim: #b2c8ed,
    on-secondary-fixed: #021c39,
    on-secondary-fixed-variant: #324767,
    tertiary: #864396,
    on-tertiary: #ffffff,
    tertiary-container: #fdd6ff,
    on-tertiary-container: #340042,
    tertiary-fixed: #fdd6ff,
    tertiary-fixed-dim: #f3aeff,
    on-tertiary-fixed: #340042,
    on-tertiary-fixed-variant: #6b2a7c,
    background: #fcf8f8,
    on-background: #1c1b1c,
    surface: #fcf8f8,
    surface-dim: #dcd9d9,
    surface-bright: #fcf8f8,
    surface-container-lowest: #ffffff,
    surface-container-low: #f6f3f3,
    surface-container: #f1eded,
    surface-container-high: #ebe7e7,
    surface-container-highest: #e5e2e2,
    on-surface: #1c1b1c,
    shadow: #000000,
    scrim: #000000,
    surface-tint: #5c5e64,
    inverse-surface: #313030,
    inverse-on-surface: #f3f0f0,
    outline: #76777b,
    outline-variant: #c6c6cc,
    neutral: #797777,
    neutral10: #1c1b1c,
    error: #ba1a1a,
    error-container: #ffdad6,
    on-error: #ffffff,
    on-error-container: #410002,
    surface-variant: #e2e2e8,
    on-surface-variant: #45474b,
    neutral-variant: #76777c,
    neutral-variant20: #2f3035,
    inverse-secondary: #b2c8ed,
    inverse-tertiary: #f3aeff,
  ));
}

/* Dark Theme */
.dark {
  @include mat.theme-overrides((
    primary: #a5c8ff,
    on-primary: #00315f,
    primary-container: #004786,
    on-primary-container: #d4e3ff,
    inverse-primary: #035faf,
    primary-fixed: #d4e3ff,
    primary-fixed-dim: #a5c8ff,
    on-primary-fixed: #001c3a,
    on-primary-fixed-variant: #004786,
    secondary: #b2c8ed,
    on-secondary: #1b314f,
    secondary-container: #324767,
    on-secondary-container: #d5e3ff,
    secondary-fixed: #d5e3ff,
    secondary-fixed-dim: #b2c8ed,
    on-secondary-fixed: #021c39,
    on-secondary-fixed-variant: #324767,
    tertiary: #f3aeff,
    on-tertiary: #520e63,
    tertiary-container: #6b2a7c,
    on-tertiary-container: #fdd6ff,
    tertiary-fixed: #fdd6ff,
    tertiary-fixed-dim: #f3aeff,
    on-tertiary-fixed: #340042,
    on-tertiary-fixed-variant: #6b2a7c,
    background: #131314,
    on-background: #e5e2e2,
    surface: #131314,
    surface-dim: #131314,
    surface-bright: #3a3939,
    surface-container-lowest: #0e0e0e,
    surface-container-low: #1c1b1c,
    surface-container: #201f20,
    surface-container-high: #2a2a2a,
    surface-container-highest: #353435,
    on-surface: #e5e2e2,
    shadow: #000000,
    scrim: #000000,
    surface-tint: #c5c6cd,
    inverse-surface: #e5e2e2,
    inverse-on-surface: #313030,
    outline: #909095,
    outline-variant: #45474b,
    neutral: #797777,
    neutral10: #1c1b1c,
    error: #ffb4ab,
    error-container: #93000a,
    on-error: #690005,
    on-error-container: #ffdad6,
    surface-variant: #45474b,
    on-surface-variant: #c6c6cc,
    neutral-variant: #76777c,
    neutral-variant20: #2f3035,
    inverse-secondary: #4a5f80,
    inverse-tertiary: #864396,
  ));
}

/* Typography */
:root, :host {
  /* core typography tokens are not generating css variables, hence below */
  --mat-sys-brand-font-family: Roboto;
  --mat-sys-plain-font-family: Roboto;
  --mat-sys-bold-font-weight: 700;
  --mat-sys-medium-font-weight: 500;
  --mat-sys-regular-font-weight: 400;

  @include mat.theme-overrides((
    brand-family: Roboto,
    plain-family: Roboto,
    bold-weight: 700,
    medium-weight: 500,
    regular-weight: 400,
  ));
}

```


6. Theme: dark_snow
```scss
/* These tokens are generated using https://themes.angular-material.dev/ */
/* Preview: https://themes.angular-material.dev/?bold-font-weight=700&brand-font-family=Roboto&medium-font-weight=500&plain-font-family=Roboto&regular-font-weight=400&seed-error=%23ba1a1a&seed-neutral=%2375777d&seed-neutral-variant=%23727783&seed-primary=%235494e7&seed-secondary=%234a5f80&seed-tertiary=%23864396 */
/* Seed Colors: primary: #5494e7, secondary: #4a5f80, tertiary: #864396, error: #ba1a1a, neutral: #75777d, neutral-variant: #727783 */
/* Seed Typography: plain-font-family: Roboto, brand-font-family: Roboto, bold-font-weight: 700, medium-font-weight: 500, regular-font-weight: 400 */

/* Make sure to import fonts in `<head>` of html */
/*
<style>
  @import url('https://fonts.googleapis.com/css2?family=Roboto&family=Roboto&display=swap');
</style>

OR

<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto&family=Roboto&display=swap">
*/

@use "@angular/material" as mat;


/* Light Theme */
:root, :host {
  @include mat.theme-overrides((
    primary: #035faf,
    on-primary: #ffffff,
    primary-container: #d4e3ff,
    on-primary-container: #001c3a,
    inverse-primary: #a5c8ff,
    primary-fixed: #d4e3ff,
    primary-fixed-dim: #a5c8ff,
    on-primary-fixed: #001c3a,
    on-primary-fixed-variant: #004786,
    secondary: #4a5f80,
    on-secondary: #ffffff,
    secondary-container: #d5e3ff,
    on-secondary-container: #021c39,
    secondary-fixed: #d5e3ff,
    secondary-fixed-dim: #b2c8ed,
    on-secondary-fixed: #021c39,
    on-secondary-fixed-variant: #324767,
    tertiary: #864396,
    on-tertiary: #ffffff,
    tertiary-container: #fdd6ff,
    on-tertiary-container: #340042,
    tertiary-fixed: #fdd6ff,
    tertiary-fixed-dim: #f3aeff,
    on-tertiary-fixed: #340042,
    on-tertiary-fixed-variant: #6b2a7c,
    background: #fcf8f8,
    on-background: #1c1b1c,
    surface: #fcf8f8,
    surface-dim: #dcd9d9,
    surface-bright: #fcf8f8,
    surface-container-lowest: #ffffff,
    surface-container-low: #f6f3f3,
    surface-container: #f1eded,
    surface-container-high: #ebe7e7,
    surface-container-highest: #e5e2e2,
    on-surface: #1c1b1c,
    shadow: #000000,
    scrim: #000000,
    surface-tint: #5c5e64,
    inverse-surface: #313030,
    inverse-on-surface: #f3f0f0,
    outline: #76777b,
    outline-variant: #c6c6cc,
    neutral: #797777,
    neutral10: #1c1b1c,
    error: #ba1a1a,
    error-container: #ffdad6,
    on-error: #ffffff,
    on-error-container: #410002,
    surface-variant: #e2e2e8,
    on-surface-variant: #45474b,
    neutral-variant: #76777c,
    neutral-variant20: #2f3035,
    inverse-secondary: #b2c8ed,
    inverse-tertiary: #f3aeff,
  ));
}

/* Dark Theme */
.dark {
  @include mat.theme-overrides((
    primary: #a5c8ff,
    on-primary: #00315f,
    primary-container: #004786,
    on-primary-container: #d4e3ff,
    inverse-primary: #035faf,
    primary-fixed: #d4e3ff,
    primary-fixed-dim: #a5c8ff,
    on-primary-fixed: #001c3a,
    on-primary-fixed-variant: #004786,
    secondary: #b2c8ed,
    on-secondary: #1b314f,
    secondary-container: #324767,
    on-secondary-container: #d5e3ff,
    secondary-fixed: #d5e3ff,
    secondary-fixed-dim: #b2c8ed,
    on-secondary-fixed: #021c39,
    on-secondary-fixed-variant: #324767,
    tertiary: #f3aeff,
    on-tertiary: #520e63,
    tertiary-container: #6b2a7c,
    on-tertiary-container: #fdd6ff,
    tertiary-fixed: #fdd6ff,
    tertiary-fixed-dim: #f3aeff,
    on-tertiary-fixed: #340042,
    on-tertiary-fixed-variant: #6b2a7c,
    background: #131314,
    on-background: #e5e2e2,
    surface: #131314,
    surface-dim: #131314,
    surface-bright: #3a3939,
    surface-container-lowest: #0e0e0e,
    surface-container-low: #1c1b1c,
    surface-container: #201f20,
    surface-container-high: #2a2a2a,
    surface-container-highest: #353435,
    on-surface: #e5e2e2,
    shadow: #000000,
    scrim: #000000,
    surface-tint: #c5c6cd,
    inverse-surface: #e5e2e2,
    inverse-on-surface: #313030,
    outline: #909095,
    outline-variant: #45474b,
    neutral: #797777,
    neutral10: #1c1b1c,
    error: #ffb4ab,
    error-container: #93000a,
    on-error: #690005,
    on-error-container: #ffdad6,
    surface-variant: #45474b,
    on-surface-variant: #c6c6cc,
    neutral-variant: #76777c,
    neutral-variant20: #2f3035,
    inverse-secondary: #4a5f80,
    inverse-tertiary: #864396,
  ));
}

/* Typography */
:root, :host {
  /* core typography tokens are not generating css variables, hence below */
  --mat-sys-brand-font-family: Roboto;
  --mat-sys-plain-font-family: Roboto;
  --mat-sys-bold-font-weight: 700;
  --mat-sys-medium-font-weight: 500;
  --mat-sys-regular-font-weight: 400;

  @include mat.theme-overrides((
    brand-family: Roboto,
    plain-family: Roboto,
    bold-weight: 700,
    medium-weight: 500,
    regular-weight: 400,
  ));
}

```

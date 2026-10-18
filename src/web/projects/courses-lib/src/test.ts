// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js';
import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

// Explicit imports - require.context() is not available in this build
// (webpack karma builder here doesn't expose it, throws
// "__webpack_require__(...).context is not a function"), so every spec
// file has to be listed here by hand to actually run. A spec not listed
// here silently never executes, even though `ng test courses-lib` reports
// success (0 of 0) - same fix already applied in trips-lib/src/test.ts.
import './lib/feature/courses-information/courses-information.component.spec';
import './lib/feature/courses-prices/courses-prices.component.spec';
import './lib/feature/courses-registration/courses-registration.component.spec';
import './lib/ui/course-registration-form/course-registration-form.component.spec';

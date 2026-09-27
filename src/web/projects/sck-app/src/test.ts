// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

// Explicit imports - require.context() is not available in this build
// (webpack karma builder here doesn't expose it, throws
// "__webpack_require__(...).context is not a function"), so every spec
// file has to be listed here by hand to actually run. A spec not listed
// here silently never executes, even though `pnpm test` reports success.
import './app/app.component.spec';
import './app/gym/gym.component.spec';
import './app/trips/trips.component.spec';
import './app/trips/components/tabs/overview/overview.component.spec';
import './app/courses/courses.component.spec';
import './app/components/home/home.component.spec';
import './app/components/home/home.component.domain.spec';
import './app/services/business/course-registration-form.service.spec';
import './app/services/business/membership-registration-form.service.spec';
import './app/services/business/trip-registration-form.service.spec';
import './app/services/business/gym-courses-registration-form.service.spec';
import '../../data/mail-templates/mail-templates.domain.spec';

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
// here silently never executes, even though `ng test shared-lib` reports
// success (0 of 0) - same fix already applied in trips-lib/src/test.ts.
import './lib/components/datenschutz/datenschutz.component.spec';
import './lib/components/dialogs/base-dialog/base-dialog.component.spec';
import './lib/components/footer/footer.component.spec';
import './lib/components/header/header.component.spec';
import './lib/components/impressum/impressum.component.spec';
import './lib/components/info-tile/info-tile.component.spec';
import './lib/components/news-banner/news-banner.component.spec';
import './lib/components/news-card/news-card.component.spec';
import './lib/components/top-bar/top-bar.component.spec';
import './lib/date-time/german-date-adapter.spec';
import './lib/pipes/native-element/native-element.pipe.spec';
import './lib/ui-common/components/buttons/base-button/base-button.component.spec';
import './lib/ui-common/components/buttons/facebook-button/facebook-button.component.spec';
import './lib/ui-common/components/buttons/instagram-button/instagram-button.component.spec';
import './lib/ui-common/components/buttons/mail-button/mail-button.component.spec';
import './lib/ui-common/components/buttons/whatsapp-button/whatsapp-button.component.spec';
import './lib/ui-common/components/comcy-copyright/comcy-copyright.component.spec';
import './lib/ui-common/components/icons/base-icon/base-icon.component.spec';
import './lib/ui-common/components/icons/instagram-icon/instagram-icon.component.spec';
import './lib/ui-common/components/icons/sck-logo-icon/sck-logo-icon.component.spec';
import './lib/ui-common/components/site-footer/site-footer.component.spec';
import './lib/ui-common/components/site-header/site-header.component.spec';
import './lib/ui-common/components/site-navigation/site-navigation.component.spec';
import './lib/ui-common/components/snackbar/snackbar.component.spec';
import './lib/ui-common/services/breakpoint-observer/breakpoint-observer.service.spec';
import './lib/util-markdown/services/markdown-render/markdown-render.service.spec';

(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! D:\TzePing\EPFWebApp\EPFWebApp\src\main.ts */"zUnb");


/***/ }),

/***/ "AytR":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const environment = {
    production: false
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "C+ye":
/*!************************************************!*\
  !*** ./src/app/language/language.component.ts ***!
  \************************************************/
/*! exports provided: LanguageComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LanguageComponent", function() { return LanguageComponent; });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var _models_signalRConnection__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../_models/_signalRConnection */ "mgtr");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var ng2_signalr__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ng2-signalr */ "yHWC");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ "tyNb");





class LanguageComponent {
    constructor(_signalR, route) {
        this._signalR = _signalR;
        this.route = route;
        this.startConnection();
    }
    ngOnInit() {
    }
    startConnection() {
        this._signalR.connect().then((c) => {
            _models_signalRConnection__WEBPACK_IMPORTED_MODULE_1__["signalRConnection"].connection = c;
            console.log("SignalR Connection is now established! " + Object(_angular_common__WEBPACK_IMPORTED_MODULE_0__["formatDate"])(new Date(), 'HH:MM:ss', 'en'));
            this.route.navigate(['verifyMyKad']);
        }).catch((err) => {
            //Catch Error
        });
    }
}
LanguageComponent.ɵfac = function LanguageComponent_Factory(t) { return new (t || LanguageComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](ng2_signalr__WEBPACK_IMPORTED_MODULE_3__["SignalR"]), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_4__["Router"])); };
LanguageComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({ type: LanguageComponent, selectors: [["app-language"]], decls: 2, vars: 0, template: function LanguageComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, "language works!");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    } }, styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJsYW5ndWFnZS5jb21wb25lbnQuY3NzIn0= */"] });


/***/ }),

/***/ "RgEQ":
/*!**********************************************************!*\
  !*** ./src/app/verify-my-kad/verify-my-kad.component.ts ***!
  \**********************************************************/
/*! exports provided: VerifyMyKadComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VerifyMyKadComponent", function() { return VerifyMyKadComponent; });
/* harmony import */ var _models_signalRConnection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_models/_signalRConnection */ "mgtr");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ngx-translate/core */ "sYmb");




class VerifyMyKadComponent {
    constructor(route, translate) {
        this.route = route;
        this.translate = translate;
        this.Status = "MyKad";
    }
    ngOnInit() {
        this.translate.use('en');
        this.intervalID = setInterval(() => {
            this.DetectMyKad();
            if (_models_signalRConnection__WEBPACK_IMPORTED_MODULE_0__["signalRConnection"].cardDetect == true) {
                clearInterval(this.intervalID);
                this.verify();
            }
        }, 1000);
    }
    ngAfterViewInit() {
        try {
            loadKeyboard();
            //signalrConnection.logsaves.push(formatDate(new Date(), 'M/d/yyyy h:MM:ss a', 'en') + " " + "WebApp Component [Account Registration]" + ": " + "After form is loaded, initialized keyboard");
        }
        catch (e) {
            //signalrConnection.logsaves.push(formatDate(new Date(), 'M/d/yyyy h:MM:ss a', 'en') + " " + "WebApp Component [Account Registration]" + ": " + "Error initializing keyboard." + e.toString());
        }
    }
    DetectMyKad() {
        return _models_signalRConnection__WEBPACK_IMPORTED_MODULE_0__["signalRConnection"].connection.invoke('IsCardDetected').then((data) => {
            _models_signalRConnection__WEBPACK_IMPORTED_MODULE_0__["signalRConnection"].cardDetect = data;
        });
    }
    verify() {
        try {
            // First Invoke
            _models_signalRConnection__WEBPACK_IMPORTED_MODULE_0__["signalRConnection"].connection.invoke('myKadRequest', this.Status).then((data) => {
                this.Status = data;
                // Not ScanThumb
                if (data.toLowerCase().includes("error")) {
                    console.log(data);
                }
                if (this.DetectMyKad()) {
                    _models_signalRConnection__WEBPACK_IMPORTED_MODULE_0__["signalRConnection"].connection.invoke('myKadRequest', this.Status).then((data) => {
                        if (data.toUpperCase().includes("SCANTHUMB")) {
                            this.Status = data;
                            if (this.DetectMyKad()) {
                                _models_signalRConnection__WEBPACK_IMPORTED_MODULE_0__["signalRConnection"].connection.invoke('ScanThumbprint').then((data) => {
                                    this.Status = data;
                                    if (this.Status.toUpperCase().includes("MISMATCH")) {
                                        console.log(data);
                                    }
                                    else if (data.toUpperCase().includes("MATCH")) {
                                        console.log(data);
                                    }
                                    else if (data.toUpperCase().includes("TIMEOUT")) {
                                        console.log(data);
                                    }
                                    else {
                                        console.log(data);
                                    }
                                });
                            }
                        }
                        else {
                            if (data.toLowerCase().includes("invalid")) {
                                //retry
                                // if(this.tryCountCard == 0){
                                //   this.loadingVisible = false;
                                //   this.insertMykadVisible = true;
                                //   this.InvalidCardVisibleFinal = true;
                                // }
                                // else{
                                //   this.loadingVisible = false;
                                //   this.insertMykadVisible = true;
                                //   this.InvalidCardVisible = true;
                                // }
                                console.log(data);
                            }
                            else {
                                console.log(data);
                            }
                        }
                    });
                }
            });
        }
        catch (e) {
        }
    }
}
VerifyMyKadComponent.ɵfac = function VerifyMyKadComponent_Factory(t) { return new (t || VerifyMyKadComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_ngx_translate_core__WEBPACK_IMPORTED_MODULE_3__["TranslateService"])); };
VerifyMyKadComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({ type: VerifyMyKadComponent, selectors: [["app-verify-my-kad"]], decls: 6, vars: 4, consts: [["type", "text", "id", "AR1", 1, "input-long", "use-keyboard-input"]], template: function VerifyMyKadComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipe"](4, "translate");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](5, "input", 0);
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.Status);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipeBind1"](4, 2, "Hello"));
    } }, pipes: [_ngx_translate_core__WEBPACK_IMPORTED_MODULE_3__["TranslatePipe"]], styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJ2ZXJpZnktbXkta2FkLmNvbXBvbmVudC5jc3MifQ== */"] });


/***/ }),

/***/ "Sq25":
/*!*************************************************!*\
  !*** ./src/app/_models/_currentMyKadDetails.ts ***!
  \*************************************************/
/*! exports provided: currentMyKadDetails */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "currentMyKadDetails", function() { return currentMyKadDetails; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");

class currentMyKadDetails {
}
currentMyKadDetails.ɵfac = function currentMyKadDetails_Factory(t) { return new (t || currentMyKadDetails)(); };
currentMyKadDetails.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({ token: currentMyKadDetails, factory: currentMyKadDetails.ɵfac, providedIn: 'root' });


/***/ }),

/***/ "Sy1n":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "tyNb");


class AppComponent {
    constructor() {
        this.title = 'EPFWebApp';
    }
}
AppComponent.ɵfac = function AppComponent_Factory(t) { return new (t || AppComponent)(); };
AppComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: AppComponent, selectors: [["app-root"]], decls: 1, vars: 0, template: function AppComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "router-outlet");
    } }, directives: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterOutlet"]], styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJhcHAuY29tcG9uZW50LmNzcyJ9 */"] });


/***/ }),

/***/ "ZAI4":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: createConfig, AppModule, HttpLoaderFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createConfig", function() { return createConfig; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HttpLoaderFactory", function() { return HttpLoaderFactory; });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "jhN1");
/* harmony import */ var ng2_signalr__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ng2-signalr */ "yHWC");
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app-routing.module */ "vY5A");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app.component */ "Sy1n");
/* harmony import */ var _models_currentMyKadDetails__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./_models/_currentMyKadDetails */ "Sq25");
/* harmony import */ var _language_language_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./language/language.component */ "C+ye");
/* harmony import */ var _models_signalRConnection__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./_models/_signalRConnection */ "mgtr");
/* harmony import */ var _verify_my_kad_verify_my_kad_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./verify-my-kad/verify-my-kad.component */ "RgEQ");
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @ngx-translate/core */ "sYmb");
/* harmony import */ var ngx_translate_multi_http_loader__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ngx-translate-multi-http-loader */ "qEH2");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/common/http */ "tk/3");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/core */ "fXoL");














// import { JsonAppConfigService } from './config/json-app-config.service';
function createConfig() {
    const c = new ng2_signalr__WEBPACK_IMPORTED_MODULE_1__["SignalRConfiguration"]();
    c.hubName = 'MyMessageHub';
    c.qs = { user: 'aldan' };
    c.url = 'http://localhost:8081/';
    c.logging = true;
    // >= v5.0.0
    c.executeEventsInZone = true; // optional, default is true
    c.executeErrorsInZone = false; // optional, default is false
    c.executeStatusChangeInZone = true; // optional, default is true
    return c;
}
// export function initializerFn(jsonAppConfigService: JsonAppConfigService) {
//   return () => {
//     return jsonAppConfigService.load();
//   };
// }
class AppModule {
}
AppModule.ɵfac = function AppModule_Factory(t) { return new (t || AppModule)(); };
AppModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdefineNgModule"]({ type: AppModule, bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_3__["AppComponent"]] });
AppModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdefineInjector"]({ providers: [
        _models_currentMyKadDetails__WEBPACK_IMPORTED_MODULE_4__["currentMyKadDetails"],
        _models_signalRConnection__WEBPACK_IMPORTED_MODULE_6__["signalRConnection"],
    ], imports: [[
            _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
            _app_routing_module__WEBPACK_IMPORTED_MODULE_2__["AppRoutingModule"],
            _angular_common_http__WEBPACK_IMPORTED_MODULE_10__["HttpClientModule"],
            _ngx_translate_core__WEBPACK_IMPORTED_MODULE_8__["TranslateModule"].forRoot({
                loader: {
                    provide: _ngx_translate_core__WEBPACK_IMPORTED_MODULE_8__["TranslateLoader"],
                    useFactory: HttpLoaderFactory,
                    deps: [_angular_common_http__WEBPACK_IMPORTED_MODULE_10__["HttpClient"]]
                }
            }),
            ng2_signalr__WEBPACK_IMPORTED_MODULE_1__["SignalRModule"].forRoot(createConfig),
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵsetNgModuleScope"](AppModule, { declarations: [_app_component__WEBPACK_IMPORTED_MODULE_3__["AppComponent"],
        _language_language_component__WEBPACK_IMPORTED_MODULE_5__["LanguageComponent"],
        _verify_my_kad_verify_my_kad_component__WEBPACK_IMPORTED_MODULE_7__["VerifyMyKadComponent"]], imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
        _app_routing_module__WEBPACK_IMPORTED_MODULE_2__["AppRoutingModule"],
        _angular_common_http__WEBPACK_IMPORTED_MODULE_10__["HttpClientModule"], _ngx_translate_core__WEBPACK_IMPORTED_MODULE_8__["TranslateModule"], ng2_signalr__WEBPACK_IMPORTED_MODULE_1__["SignalRModule"]] }); })();
function HttpLoaderFactory(http) {
    return new ngx_translate_multi_http_loader__WEBPACK_IMPORTED_MODULE_9__["MultiTranslateHttpLoader"](http, [
        { prefix: "./assets/translate/", suffix: ".json" },
    ]);
}


/***/ }),

/***/ "mgtr":
/*!***********************************************!*\
  !*** ./src/app/_models/_signalRConnection.ts ***!
  \***********************************************/
/*! exports provided: signalRConnection */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "signalRConnection", function() { return signalRConnection; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");

class signalRConnection {
}
signalRConnection.isVerifyMyKad = false;
signalRConnection.ɵfac = function signalRConnection_Factory(t) { return new (t || signalRConnection)(); };
signalRConnection.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({ token: signalRConnection, factory: signalRConnection.ɵfac, providedIn: 'root' });


/***/ }),

/***/ "vY5A":
/*!***************************************!*\
  !*** ./src/app/app-routing.module.ts ***!
  \***************************************/
/*! exports provided: AppRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppRoutingModule", function() { return AppRoutingModule; });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _language_language_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./language/language.component */ "C+ye");
/* harmony import */ var _verify_my_kad_verify_my_kad_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./verify-my-kad/verify-my-kad.component */ "RgEQ");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "fXoL");





const routes = [
    { path: '', redirectTo: '/language', pathMatch: 'full' },
    { path: 'language', component: _language_language_component__WEBPACK_IMPORTED_MODULE_1__["LanguageComponent"] },
    { path: 'verifyMyKad', component: _verify_my_kad_verify_my_kad_component__WEBPACK_IMPORTED_MODULE_2__["VerifyMyKadComponent"] },
];
class AppRoutingModule {
}
AppRoutingModule.ɵfac = function AppRoutingModule_Factory(t) { return new (t || AppRoutingModule)(); };
AppRoutingModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineNgModule"]({ type: AppRoutingModule });
AppRoutingModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjector"]({ imports: [[_angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"].forRoot(routes)], _angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵsetNgModuleScope"](AppRoutingModule, { imports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"]], exports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"]] }); })();


/***/ }),

/***/ "zUnb":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "jhN1");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "ZAI4");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments/environment */ "AytR");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["enableProdMode"])();
}
_angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["platformBrowser"]().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(err => console.error(err));


/***/ }),

/***/ "zn8P":
/*!******************************************************!*\
  !*** ./$$_lazy_route_resource lazy namespace object ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "zn8P";

/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map
'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">nest-new-project documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AppModule-e81692aeb7ed4f23b7dd7310b7798d92e79d34ff8d88239616ee5b6b71768f43fcb4855423e70fe1ec728c0baa57aea23f76c65a9239fc01564598686039a4f3"' : 'data-bs-target="#xs-controllers-links-module-AppModule-e81692aeb7ed4f23b7dd7310b7798d92e79d34ff8d88239616ee5b6b71768f43fcb4855423e70fe1ec728c0baa57aea23f76c65a9239fc01564598686039a4f3"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-e81692aeb7ed4f23b7dd7310b7798d92e79d34ff8d88239616ee5b6b71768f43fcb4855423e70fe1ec728c0baa57aea23f76c65a9239fc01564598686039a4f3"' :
                                            'id="xs-controllers-links-module-AppModule-e81692aeb7ed4f23b7dd7310b7798d92e79d34ff8d88239616ee5b6b71768f43fcb4855423e70fe1ec728c0baa57aea23f76c65a9239fc01564598686039a4f3"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AppModule-e81692aeb7ed4f23b7dd7310b7798d92e79d34ff8d88239616ee5b6b71768f43fcb4855423e70fe1ec728c0baa57aea23f76c65a9239fc01564598686039a4f3"' : 'data-bs-target="#xs-injectables-links-module-AppModule-e81692aeb7ed4f23b7dd7310b7798d92e79d34ff8d88239616ee5b6b71768f43fcb4855423e70fe1ec728c0baa57aea23f76c65a9239fc01564598686039a4f3"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-e81692aeb7ed4f23b7dd7310b7798d92e79d34ff8d88239616ee5b6b71768f43fcb4855423e70fe1ec728c0baa57aea23f76c65a9239fc01564598686039a4f3"' :
                                        'id="xs-injectables-links-module-AppModule-e81692aeb7ed4f23b7dd7310b7798d92e79d34ff8d88239616ee5b6b71768f43fcb4855423e70fe1ec728c0baa57aea23f76c65a9239fc01564598686039a4f3"' }>
                                        <li class="link">
                                            <a href="injectables/AppService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AuthModule-772e1295c57d29942d8b86682c6acc1f25ff8c086c8954b5f1138865b7f30a17ee752d21b33ab34dc071475134abcaf6b127eddadd1b0274540ab34c6c6e7ce1"' : 'data-bs-target="#xs-controllers-links-module-AuthModule-772e1295c57d29942d8b86682c6acc1f25ff8c086c8954b5f1138865b7f30a17ee752d21b33ab34dc071475134abcaf6b127eddadd1b0274540ab34c6c6e7ce1"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-772e1295c57d29942d8b86682c6acc1f25ff8c086c8954b5f1138865b7f30a17ee752d21b33ab34dc071475134abcaf6b127eddadd1b0274540ab34c6c6e7ce1"' :
                                            'id="xs-controllers-links-module-AuthModule-772e1295c57d29942d8b86682c6acc1f25ff8c086c8954b5f1138865b7f30a17ee752d21b33ab34dc071475134abcaf6b127eddadd1b0274540ab34c6c6e7ce1"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AuthModule-772e1295c57d29942d8b86682c6acc1f25ff8c086c8954b5f1138865b7f30a17ee752d21b33ab34dc071475134abcaf6b127eddadd1b0274540ab34c6c6e7ce1"' : 'data-bs-target="#xs-injectables-links-module-AuthModule-772e1295c57d29942d8b86682c6acc1f25ff8c086c8954b5f1138865b7f30a17ee752d21b33ab34dc071475134abcaf6b127eddadd1b0274540ab34c6c6e7ce1"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-772e1295c57d29942d8b86682c6acc1f25ff8c086c8954b5f1138865b7f30a17ee752d21b33ab34dc071475134abcaf6b127eddadd1b0274540ab34c6c6e7ce1"' :
                                        'id="xs-injectables-links-module-AuthModule-772e1295c57d29942d8b86682c6acc1f25ff8c086c8954b5f1138865b7f30a17ee752d21b33ab34dc071475134abcaf6b127eddadd1b0274540ab34c6c6e7ce1"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UserModule.html" data-type="entity-link" >UserModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-UserModule-7b4ff28c11e2515004ce3fa4200c7bf119870cc815ac852cd2297d94827f02e949ecbb4f0b44975e64ba7de8186f7457d8742ca827705d12937e6394ebf6e64e"' : 'data-bs-target="#xs-controllers-links-module-UserModule-7b4ff28c11e2515004ce3fa4200c7bf119870cc815ac852cd2297d94827f02e949ecbb4f0b44975e64ba7de8186f7457d8742ca827705d12937e6394ebf6e64e"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UserModule-7b4ff28c11e2515004ce3fa4200c7bf119870cc815ac852cd2297d94827f02e949ecbb4f0b44975e64ba7de8186f7457d8742ca827705d12937e6394ebf6e64e"' :
                                            'id="xs-controllers-links-module-UserModule-7b4ff28c11e2515004ce3fa4200c7bf119870cc815ac852cd2297d94827f02e949ecbb4f0b44975e64ba7de8186f7457d8742ca827705d12937e6394ebf6e64e"' }>
                                            <li class="link">
                                                <a href="controllers/UserController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-UserModule-7b4ff28c11e2515004ce3fa4200c7bf119870cc815ac852cd2297d94827f02e949ecbb4f0b44975e64ba7de8186f7457d8742ca827705d12937e6394ebf6e64e"' : 'data-bs-target="#xs-injectables-links-module-UserModule-7b4ff28c11e2515004ce3fa4200c7bf119870cc815ac852cd2297d94827f02e949ecbb4f0b44975e64ba7de8186f7457d8742ca827705d12937e6394ebf6e64e"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UserModule-7b4ff28c11e2515004ce3fa4200c7bf119870cc815ac852cd2297d94827f02e949ecbb4f0b44975e64ba7de8186f7457d8742ca827705d12937e6394ebf6e64e"' :
                                        'id="xs-injectables-links-module-UserModule-7b4ff28c11e2515004ce3fa4200c7bf119870cc815ac852cd2297d94827f02e949ecbb4f0b44975e64ba7de8186f7457d8742ca827705d12937e6394ebf6e64e"' }>
                                        <li class="link">
                                            <a href="injectables/UserService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#entities-links"' :
                                'data-bs-target="#xs-entities-links"' }>
                                <span class="icon ion-ios-apps"></span>
                                <span>Entities</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="entities-links"' : 'id="xs-entities-links"' }>
                                <li class="link">
                                    <a href="entities/User.html" data-type="entity-link" >User</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});
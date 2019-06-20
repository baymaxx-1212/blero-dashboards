'use strict';

var helpers = require('djangocms-casper-helpers');
var globals = helpers.settings;
var casperjs = require('casper');
var cms = helpers(casperjs);
var xPath = casperjs.selectXPath;

casper.test.setUp(function (done) {
    casper.start()
        .then(cms.login())
        .run(done);
});

casper.test.tearDown(function (done) {
    casper.start()
        .then(cms.logout())
        .run(done);
});

casper.test.begin('Creation / deletion of the apphook', function (test) {
    casper
        .start(globals.adminUrl)
        .waitUntilVisible('#content', function () {
            test.assertVisible('#content', 'Admin loaded');
            this.click(
                xPath(cms.getXPathForAdminSection({
                    section: 'Aldryn News & Blog',
                    row: 'Sections',
                    link: 'Add'
                }))
            );
        })
        .waitForUrl(/add/)
        .waitUntilVisible('#dashboards_appconfig_form')
        .then(function () {
            test.assertVisible('#dashboards_appconfig_form', 'Apphook creation form loaded');

            this.fill('#dashboards_appconfig_form', {
                namespace: 'Test namespace',
                app_title: 'Test Blog'
            }, true);
        })
        .waitUntilVisible('.success', function () {
            test.assertSelectorHasText(
                '.success',
                'The Section "Test Blog" was added successfully.',
                'Apphook config was created'
            );

            test.assertElementCount(
                '#result_list tbody tr',
                2,
                'There are 2 apphooks now'
            );

            this.clickLabel('Test Blog', 'a');
        })
        .waitUntilVisible('.deletelink', function () {
            this.click('.deletelink');
        })
        .waitForUrl(/delete/, function () {
            this.click('input[value="Yes, I\'m sure"]');
        })
        .waitUntilVisible('.success', function () {
            test.assertSelectorHasText(
                '.success',
                'The Section "Test Blog" was deleted successfully.',
                'Apphook config was deleted'
            );
        })
        .run(function () {
            test.done();
        });
});

cms._modifyPageAdvancedSettings = function _modifyPageAdvancedSettings(opts) {
    var that = this;

    return function () {
        return this.wait(1000).thenOpen(globals.adminPagesUrl)
            .waitUntilVisible('.cms-pagetree-jstree')
            .then(that.waitUntilAllAjaxCallsFinish())
            .then(that.expandPageTree())
            .then(function () {
                var pageId = that.getPageId(opts.page);

                this.thenOpen(globals.adminPagesUrl + pageId + '/advanced-settings/');
            })
            .waitForSelector('#page_form', function () {
                this.fill('#page_form', opts.fields);
            })
            .wait(100, function () {
                this.click('input.default');
            })
            .waitForUrl(/page/)
            .waitUntilVisible('.success')
            .then(that.waitUntilAllAjaxCallsFinish())
            .wait(1000);
    };
};

casper.test.begin('Creation / deletion of the dashboard', function (test) {
    casper
        .start()
        .then(cms.addPage({ title: 'Blog' }))
        .then(cms._modifyPageAdvancedSettings({
            page: 'Blog',
            fields: {
                application_configs: 1,
                application_urls: 'Dashboards_appApp'
            }
        }))
        .then(cms.publishPage({
            page: 'Blog'
        }))
        .thenOpen(globals.editUrl, function () {
            test.assertSelectorHasText('p', 'No items available', 'No dashboards yet');
        })
        .thenOpen(globals.adminUrl)
        .waitUntilVisible('#content', function () {
            test.assertVisible('#content', 'Admin loaded');
            this.click(
                xPath(cms.getXPathForAdminSection({
                    section: 'Aldryn News & Blog',
                    row: 'Dashboards',
                    link: 'Add'
                }))
            );
        })
        .waitForUrl(/add/)
        .waitUntilVisible('#dashboard_form')
        .then(function () {
            test.assertVisible('#dashboard_form', 'Dashboard creation form loaded');

            this.fill('#dashboard_form', {
                title: 'Test dashboard'
            }, true);
        })
        .waitUntilVisible('.success', function () {
            test.assertSelectorHasText(
                '.success',
                'The dashboard "Test dashboard" was added successfully.',
                'Dashboard was created'
            );

            test.assertElementCount(
                '#result_list tbody tr',
                1,
                'There is 1 dashboard available'
            );
        })
        .thenOpen(globals.editUrl, function () {
            test.assertSelectorHasText(
                '.dashboard.unpublished h2 a',
                'Test dashboard',
                'Dashboard is available on the page'
            );
        })
        .thenOpen(globals.adminUrl)
        .waitUntilVisible('#content', function () {
            this.click(
                xPath(cms.getXPathForAdminSection({
                    section: 'Aldryn News & Blog',
                    row: 'Dashboards'
                }))
            );
        })
        .waitForUrl(/dashboard/, function () {
            this.clickLabel('Test dashboard', 'a');
        })
        .waitUntilVisible('.deletelink', function () {
            this.click('.deletelink');
        })
        .waitForUrl(/delete/, function () {
            this.click('input[value="Yes, I\'m sure"]');
        })
        .waitUntilVisible('.success', function () {
            test.assertSelectorHasText(
                '.success',
                'The dashboard "Test dashboard" was deleted successfully.',
                'Dashboard was deleted'
            );
        })
        .then(cms.removePage())
        .run(function () {
            test.done();
        });
});

casper.test.begin('Latest dashboards plugin', function (test) {
    casper
        .start()
        .then(cms.addPage({ title: 'Home' }))
        .then(cms.addPlugin({
            type: 'Dashboards_appLatestDashboardsPlugin',
            content: {
                id_latest_dashboards: 1
            }
        }))
        .thenOpen(globals.editUrl, function () {
            test.assertSelectorHasText(
                'p.cms-plugin',
                'No items available',
                'No dashboards yet'
            );
        })
        .then(cms.openSideframe())
        // add dashboards
        .withFrame(0, function () {
            this.waitForSelector('.cms-pagetree-breadcrumbs')
                .then(function () {
                    this.click('.cms-pagetree-breadcrumbs a:first-child');
                })
                .waitForUrl(/admin/)
                .waitForSelector('.dashboard', function () {
                    this.click(xPath(cms.getXPathForAdminSection({
                        section: 'Aldryn News & Blog',
                        row: 'Dashboards',
                        link: 'Add'
                    })));
                })
                .waitForSelector('#dashboard_form', function () {
                    this.fill('#dashboard_form', {
                        title: 'First dashboard'
                    }, false);

                })
                // wait 3 seconds so the second dashboard is definitely
                // created after the first one :)
                .wait(3000, function () {
                    this.click('input[value="Save and add another"]');
                })
                .waitForSelector('.success', function () {
                    test.assertSelectorHasText(
                        '.success',
                        'The dashboard "First dashboard" was added successfully. You may add another dashboard below.',
                        'First dashboard added'
                    );

                    this.fill('#dashboard_form', {
                        title: 'Second dashboard'
                    }, true);
                })
                .waitForSelector('.success');
        })
        .thenOpen(globals.editUrl, function () {
            test.assertSelectorHasText(
                'p.cms-plugin',
                'No items available',
                'Still no dashboards yet (no apphooked page yet)'
            );
        })
        .then(cms.addPage({ title: 'Blog' }))
        .then(cms.addApphookToPage({
            page: 'Blog',
            apphook: 'Dashboards_appApp'
        }))
        .then(cms.publishPage({ page: 'Blog' }))
        .thenOpen(globals.editUrl, function () {
            test.assertSelectorHasText(
                '.dashboard h2 a cms-plugin',
                'Second dashboard',
                'Latest dashboard is visible on the page'
            );
            test.assertElementCount(
                '.dashboard cms-plugin',
                1,
                'Only one latest dashboard is visible on the page'
            );
        })
        // remove dashboards
        .then(cms.openSideframe())
        .withFrame(0, function () {
            this.waitForSelector('.cms-pagetree-breadcrumbs')
                .then(function () {
                    this.click('.cms-pagetree-breadcrumbs a:first-child');
                })
                .waitForUrl(/admin/)
                .waitForSelector('.dashboard', function () {
                    this.click(xPath(cms.getXPathForAdminSection({
                        section: 'Aldryn News & Blog',
                        row: 'Dashboards'
                    })));
                })
                .waitForSelector('#changelist-form', function () {
                    this.click('th input[type="checkbox"]');
                    this.fill('#changelist-form', {
                        action: 'delete_selected'
                    }, true);

                })
                .waitForSelector('.delete-confirmation', function () {
                    this.click('input[value="Yes, I\'m sure"]');
                })
                .waitForSelector('.success', function () {
                    test.assertSelectorHasText(
                        '.success',
                        'Successfully deleted 2 dashboards.',
                        'Dashboards deleted'
                    );
                });
        })
        .then(cms.removePage())
        .then(cms.removePage())
        .run(function () {
            test.done();
        });
});

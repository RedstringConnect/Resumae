(function() {

    if(window.location.href.indexOf('com/sales/') !== -1){
    
        (function() {
        var origOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function() {
        
        this.onreadystatechange = function(response) {
        
        //console.log('EVENT CHANGED')
        
        
        if(response.currentTarget !== undefined){
        
        
        
        if(response.currentTarget.responseURL !== undefined){
        
        urlRequested = response.currentTarget.responseURL;
        
        console.log('url requested: '+urlRequested)
        
        if(
            (urlRequested !== undefined && urlRequested.indexOf('salesApiPeopleSearch') !== -1) ||
            (urlRequested !== undefined && urlRequested.indexOf('salesApiLeadSearch') !== -1)
        ){
        
        if(this.readyState == 4) {
        
            if(this.status == 200) {
        
                jsonProfiles = JSON.parse(this.responseText);
        
                console.log(jsonProfiles)
        
                ///
                    allProfiles = {};
        
                    if(jsonProfiles['elements'] !== undefined){
        
                        // $.each(jsonProfiles['elements'], function( k, v ) {
        
                        jsonProfiles['elements'].forEach(function(v) {
        
                            // console.log(v);
        
                            userObject = {};
                            userObject['company_size'] = '';
                            userObject['domain'] = '';
                            userObject['founded'] = '';
                            userObject['industry'] = '';
                            userObject['job_title'] = '';
                            userObject['linkedin_id'] = '';
                            userObject['past_company'] = '';
                            userObject['rewards'] = '';
                            userObject['skills'] = '';
                            userObject['type'] = '';
                            userObject['user__summary__experience'] = '';
                            userObject['user_city'] = '';
                            userObject['user_company_id'] = '';
                            userObject['user_company_name'] = '';
                            userObject['user_first_name'] = '';
                            userObject['user_keywords'] = '';
                            userObject['user_last_name'] = '';
                            userObject['user_number_connections'] = '';
                            userObject['user_other_email'] = '';
                            userObject['user_profile_picture'] = '';
                            userObject['user_source'] = 'linkedin';
                            userObject['user_summary'] = '';
                            userObject['user_url'] = '';
                            userObject['vcard'] = '';
                            userObject['website'] = '';
        
                            if(v['currentPositions'] !== undefined && v['currentPositions']['companyName'] !== undefined){
                                userObject['user_company_name'] = InterceptorcleanCompanyName(v['currentPositions']['companyName']);
                            }
        
                            if(v['currentPositions'] !== undefined && v['currentPositions']['companyUrn'] !== undefined){
                                userObject['user_company_id'] = InterceptorextractIdNewLinkedinCompany(v['currentPositions']['companyUrn']);
                            }
        
                            if(v['geoRegion'] !== undefined && v['geoRegion'] !== undefined){
                                userObject['user_city'] = v['geoRegion'];
                            }
        
                            if(v['currentPositions'] !== undefined && v['currentPositions']['title'] !== undefined){
                                userObject['job_title'] = InterceptorUnescapeHtml(v['currentPositions']['title']);
                            }
        
                            if(v['firstName'] !== undefined){
                                userObject['user_first_name'] = InterceptorcleanNameComma(v['firstName']);
                            }
        
                            if(v['lastName'] !== undefined){
                                userObject['user_last_name'] = InterceptorcleanNameComma(v['lastName']);
                            }
        
                            if(v['objectUrn'] !== undefined){
                                userObject['linkedin_id'] = InterceptorextractIdNewLinkedin(v['objectUrn']);
                            }
                            
                            if(v['currentPositions'] !== undefined && v['currentPositions']['companyName'] !== undefined){
                                companyNameSearch = v['currentPositions']['companyName'];
                            }else {
                                companyNameSearch = '';
                            }
        
                            if(v['currentPositions'] !== undefined && v['currentPositions'].length > 0){
        
                                                console.log(v['currentPositions'].length)
        
                                                for (var index = 0; index < v['currentPositions'].length; index++) {
                                                    var element = v['currentPositions'][index];
        
                                                    if(element['current'] !== undefined && element['current'] === true){
        
                                                        if(element['title'] !== undefined){
        
                                                            userObject['job_title'] = InterceptorUnescapeHtml(element['title']);
                                                        
        
                                                        }
        
                                                        if(element['companyName'] !== undefined){
        
                                                            userObject['user_company_name'] = InterceptorcleanCompanyName(element['companyName']);
                                                            companyNameSearch = element['companyName'];
        
                                                        }
        
                                                        if(element['companyUrn'] !== undefined){
        
                                                            userObject['user_company_id'] = InterceptorextractIdNewLinkedinCompany(element['companyUrn']);
        
                                                        }
        
                                                    }
                                                    
                                                }
        
                            }
        
                            if(v['entityUrn'] !== undefined){
                                userObject['user_url'] = v['entityUrn'].toString().replace('urn:li:fs_salesProfile:(', 'https://www.linkedin.com/sales/people/')
                                userObject['user_url'] = userObject['user_url'].replace(',ibn_)', '');
                                userObject['user_url'] = userObject['user_url'].replace(')', '');
        
                            }
        
                            if(userObject['linkedin_id'] !== ''){
                                allProfiles[userObject['linkedin_id']] = userObject;
                            }
        
                        });
        
                        if(Object.keys(allProfiles).length > 0){
                            console.log('Local storage 1 size: ' + Object.keys(allProfiles).length);
                            console.log(allProfiles);
                            console.log('Local storage 1');
                            window.postMessage({
                                source: 'my-extension',
                                type: 'SAVE_PROFILES',
                                data: allProfiles
                            }, '*');
                            localStorage.setItem("INTERCEPTOR3837383", JSON.stringify(allProfiles));
                        }
        
        
        
                    }
                
                ///
        
            } else if(this.responseText != "") {
                
            }
        } else if(this.readyState == 2) {
            if(this.status == 200) {
                
                this.responseType = "text";
                
            } else {
                
                this.responseType = "text";
            }
        }
        
        }
        
        }	
        
        }
        };
        
        origOpen.apply(this, arguments);
        };
        })();
    
    }

})();

if(window.location.href.indexOf('linkedin.com') !== -1){

    (function(xhr) {
        var XHR = XMLHttpRequest.prototype;
        var open = XHR.open;
        var send = XHR.send;
        var setRequestHeader = XHR.setRequestHeader;
        XHR.open = function(method, url) {
            this._method = method;
            this._url = url;
            this._requestHeaders = {};
            this._startTime = (new Date()).toISOString();
            return open.apply(this, arguments);
        };
        XHR.setRequestHeader = function(header, value) {
            this._requestHeaders[header] = value;
            return setRequestHeader.apply(this, arguments);
        };
        XHR.send = function(postData) {
            this.addEventListener('load', function() {
                var endTime = (new Date()).toISOString();
                var urlRequested = this._url ? this._url.toLowerCase() : this._url;

                allProfiles = {};
                
                if(window.location.href.indexOf('com/sales/') === -1){

                    if((urlRequested !== undefined && urlRequested.indexOf('/voyager/api/search/blended') !== -1) ||
                    (urlRequested !== undefined && urlRequested.indexOf('/voyager/api/search/dash/clusters') !== -1) ||
                    (urlRequested !== undefined && urlRequested.indexOf('voyagerSearchDashLazyLoadedActions') !== -1) ||
                    (urlRequested !== undefined && urlRequested.indexOf('/voyager/api/graphql') !== -1)){

                        if (this.response instanceof Blob) {
                            this.response.text().then(text => {
                                try {
                                    
                                    
                                    /////// premium code

                                    jsonProfiles = JSON.parse(text);
    
                                    if(urlRequested.indexOf('/voyager/api/search/blended') !== -1){
                            
                                        if(jsonProfiles['data'] !== undefined && jsonProfiles['data']['elements'] !== undefined && jsonProfiles['data']['elements'][0] !== undefined && jsonProfiles['data']['elements'][0]['elements'] !== undefined){
                            
                                            var iCountLoop = 0;
                            
                                            jsonProfiles['data']['elements'][0]['elements'].forEach(function(v) {
                            
                                                userObject = {};
                                                userObject['company_size'] = '';
                                                userObject['domain'] = '';
                                                userObject['founded'] = '';
                                                userObject['industry'] = '';
                                                userObject['job_title'] = '';
                                                userObject['linkedin_id'] = '';
                                                userObject['past_company'] = '';
                                                userObject['rewards'] = '';
                                                userObject['skills'] = '';
                                                userObject['type'] = '';
                                                userObject['user__summary__experience'] = '';
                                                userObject['user_city'] = '';
                                                userObject['user_company_id'] = '';
                                                userObject['user_company_name'] = '';
                                                userObject['user_first_name'] = '';
                                                userObject['user_keywords'] = '';
                                                userObject['user_last_name'] = '';
                                                userObject['user_number_connections'] = '';
                                                userObject['user_other_email'] = '';
                                                userObject['user_profile_picture'] = '';
                                                userObject['user_source'] = 'linkedin';
                                                userObject['user_summary'] = '';
                                                userObject['user_url'] = '';
                                                userObject['vcard'] = '';
                                                userObject['website'] = '';
                            
                                                // console.log(v);
                            
                                                if(v['snippetText'] !== undefined && v['snippetText']['text'] !== undefined){
                                                    userObject['user_company_name'] = InterceptorcleanCompanyName(InterceptorCompanyPremium(v['snippetText']['text']));
                                                }else {
                                                    companyNameSearch = '';
                                                }
                            
                                                if(userObject['user_company_name'] == ''){
                            
                                                    if(v['headline'] !== undefined && v['headline']['text'] !== undefined){
                                                        userObject['user_company_name'] = InterceptorcleanCompanyName(InterceptorCompanyPremium(v['headline']['text']));
                                                    }else {
                                                        companyNameSearch = '';
                                                    }
                            
                                                }
                            
                                                if(v['subline'] !== undefined && v['subline']['text'] !== undefined){
                                                    userObject['user_city'] = v['subline']['text'];
                                                }
                            
                                                if(v['headline'] !== undefined && v['headline']['text'] !== undefined){
                                                    userObject['job_title'] = InterceptorUnescapeHtml(v['headline']['text']);
                                                }
                            
                            
                            
                                                if(v['title'] !== undefined && v['title']['text'] !== undefined){
                                                    base__name__profile = InterceptorcleanName(v['title']['text']);        
                                                    userObject['user_first_name'] = InterceptorcleanNameComma(base__name__profile[0]);
                                                    userObject['user_last_name'] = InterceptorcleanNameComma(base__name__profile[1]);
                                                }
                            
                                                if(v['trackingUrn'] !== undefined){
                                                    userObject['linkedin_id'] = InterceptorextractIdNewLinkedin(v['trackingUrn']);
                                                }
                            
                                                if(v['publicIdentifier'] !== undefined){
                                                    userObject['user_url'] = 'https://linkedin.com/in/'+v['publicIdentifier'];
                            
                                                }
                            
                                                if(v['navigationUrl'] !== undefined){
                            
                                                    userObject['user_url'] = v['navigationUrl'];
                            
                                                }
                            
                                                if(userObject['linkedin_id'] !== ''){
                            
                                                    allProfiles[userObject['linkedin_id']] = userObject;
                            
                                                }
                                                
                            
                                                iCountLoop++;
                            
                                            });
                            
                                            if(Object.keys(allProfiles).length > 0){
                                                console.log('Local storage 2');
                                                console.log('Local storage 2 size: ' + Object.keys(allProfiles).length);
                                                console.log('size storage: ' + allProfiles.length);
                                                console.log(allProfiles);
                                                window.postMessage({
                                                    source: 'my-extension',
                                                    type: 'SAVE_PROFILES',
                                                    data: allProfiles
                                                }, '*');
                                                localStorage.setItem("INTERCEPTOR3837383", JSON.stringify(allProfiles));
                                            }
                            
                            
                                        }
                            
                                    }
                            
                                    if(
                                        urlRequested.indexOf('/voyager/api/search/dash/clusters') !== -1 ||
                                        urlRequested.indexOf('voyagerSearchDashLazyLoadedActions') !== -1 ||
                                        urlRequested.indexOf('graphql') !== -1 
                                    ){
                            
                                        console.log('matched loaded actions lazy 2: '+urlRequested)
                            
                                        console.log(jsonProfiles);
                            
                                        if(jsonProfiles['included'] !== undefined){
                            
                                            var iCountLoop = 0;
                            
                                            var graphQlCountMatch = 0;
                            
                                            jsonProfiles['included'].forEach(function(v) {
                            
                                                
                            
                                                if(v['trackingUrn'] !== undefined && v['trackingUrn'] !== null && v['trackingUrn'].indexOf('urn:li:member:') !== -1){
                            
                                                    // console.log(v)
                            
                                                    userObject = {};
                                                    userObject['company_size'] = '';
                                                    userObject['domain'] = '';
                                                    userObject['founded'] = '';
                                                    userObject['industry'] = '';
                                                    userObject['job_title'] = '';
                                                    userObject['linkedin_id'] = '';
                                                    userObject['past_company'] = '';
                                                    userObject['rewards'] = '';
                                                    userObject['skills'] = '';
                                                    userObject['type'] = '';
                                                    userObject['user__summary__experience'] = '';
                                                    userObject['user_city'] = '';
                                                    userObject['user_company_id'] = '';
                                                    userObject['user_company_name'] = '';
                                                    userObject['user_first_name'] = '';
                                                    userObject['user_keywords'] = '';
                                                    userObject['user_last_name'] = '';
                                                    userObject['user_number_connections'] = '';
                                                    userObject['user_other_email'] = '';
                                                    userObject['user_profile_picture'] = '';
                                                    userObject['user_source'] = 'linkedin';
                                                    userObject['user_summary'] = '';
                                                    userObject['user_url'] = '';
                                                    userObject['vcard'] = '';
                                                    userObject['website'] = '';
                            
                                                    // console.log(v);
                            
                                                    if(v['summary'] !== undefined && v['summary'] !== null && v['summary']['text'] !== undefined){
                                                        userObject['user_company_name'] = InterceptorcleanCompanyName(InterceptorCompanyPremium(v['summary']['text']));
                                                    }else {
                                                        companyNameSearch = '';
                                                    }
                            
                                                    if(userObject['user_company_name'] == ''){
                            
                                                        if(v['primarySubtitle'] !== undefined && v['primarySubtitle']['text'] !== undefined){
                                                            userObject['user_company_name'] = InterceptorcleanCompanyName(InterceptorCompanyPremium(v['primarySubtitle']['text']));
                                                        }else {
                                                            companyNameSearch = '';
                                                        }
                            
                                                    }
                            
                                                    if(v['secondarySubtitle'] !== undefined && v['secondarySubtitle']['text'] !== undefined && v['secondarySubtitle']['textDirection'] !== undefined && v['secondarySubtitle']['textDirection'] === 'USER_LOCALE'){
                                                        userObject['user_city'] = v['secondarySubtitle']['text'];
                                                    }
                            
                                                    if(v['headline'] !== undefined){
                                                        userObject['job_title'] = InterceptorUnescapeHtml(v['headline']);
                                                    }
                            
                                                    if(v['primarySubtitle'] !== undefined && v['primarySubtitle']['text'] !== undefined){
                                                        userObject['job_title'] = v['primarySubtitle']['text'];
                                                    }
                            
                                                    if(v['firstName'] !== undefined){
                                                        
                                                        userObject['user_first_name'] = InterceptorcleanNameComma(v['firstName']);
                                                        
                                                    }
                            
                                                    if(v['lastName'] !== undefined){
                                                        
                                                        userObject['user_last_name'] = InterceptorcleanNameComma(v['lastName']);
                                                        
                                                    }
                            
                                                    if(v['title'] !== undefined && v['title']['textDirection'] !== undefined && v['title']['textDirection'] === 'FIRST_STRONG'){
                                                        base__name__profile = InterceptorcleanName(v['title']['text']);        
                                                        userObject['user_first_name'] = InterceptorcleanNameComma(base__name__profile[0]);
                                                        userObject['user_last_name'] = InterceptorcleanNameComma(base__name__profile[1]);
                                                    }
                            
                                                    if(v['trackingUrn'] !== undefined){
                                                        userObject['linkedin_id'] = InterceptorextractIdNewLinkedin(v['trackingUrn']);
                                                    }
                            
                                                    if(v['navigationUrl'] !== undefined){
                                                        userObject['user_url'] = v['navigationUrl'];
                            
                                                    }
                            
                                                    if(userObject['linkedin_id'] !== ''){
                            
                                                        allProfiles[userObject['linkedin_id']] = userObject;
                            
                                                    }
                            
                                                    // second patch graph QL
                            
                                                    if(v['template'] !== undefined){
                            
                                                        
                            
                                                        if(v['template'] === 'UNIVERSAL'){
                                                            console.log('Matched Graph QL route')
                            
                                                            if(v['primarySubtitle'] !== undefined){
                                                                if(v['primarySubtitle']['text'] !== undefined){
                                                                    userObject['user_company_name'] = InterceptorcleanCompanyName(InterceptorCompanyPremium(v['primarySubtitle']['text']));
                                                                }
                                                            }else {
                                                                companyNameSearch = '';
                                                            }
                            
                                                            if(v['primarySubtitle'] !== undefined){
                                                                if(v['primarySubtitle']['text'] !== undefined){
                                                                    userObject['job_title'] = InterceptorUnescapeHtml(v['primarySubtitle']['text']);
                                                                }
                                                            }
                                    
                                                            if(v['title'] !== undefined){
                                                                if(v['title']['text'] !== undefined){
                                                                    objectTitleView = v['title']['text'].split(' ');
                                                                    if(objectTitleView[0] !== undefined){
                                                                        userObject['user_first_name'] = InterceptorcleanNameComma(objectTitleView[0]);
                                                                    }
                                                                    if(objectTitleView[1] !== undefined){
                                                                        userObject['user_last_name'] = InterceptorcleanNameComma(objectTitleView[1]);
                                                                    }
                                                                }
                                                                
                                                            }
                                    
                                                            if(v['trackingUrn'] !== undefined){
                                                                userObject['linkedin_id'] = InterceptorextractIdNewLinkedin(v['trackingUrn']);
                                                            }
                                    
                                                            if(v['navigationUrl'] !== undefined){
                                                                userObject['user_url'] = InterceptorCleanLinkedinPublicUrl(v['navigationUrl']);
                                                            }
                                    
                                                            //
                                    
                                                            if(v['secondarySubtitle'] !== undefined){
                            
                                                                if(v['textDirection'] !== undefined){
                            
                                                                    if(v['textDirection'] === 'USER_LOCALE'){
                            
                                                                        if(v['secondarySubtitle']['text'] !== undefined){
                            
                                                                            userObject['user_city'] = v['secondarySubtitle']['text']
                            
                                                                        }
                            
                                                                    }
                            
                                                                }
                            
                                                            }
                                        
                                                            if(userObject['linkedin_id'] !== ''){
                                                                
                                                                console.log('Graph Ql patch')
                                                                console.log(userObject)
                                                                graphQlCountMatch++;
                                                                console.log('matched graph ql count: '+graphQlCountMatch)
                                                                allProfiles[userObject['linkedin_id']] = userObject;
                                    
                                                            }
                                                            
                                                            
                                    
                                                            iCountLoop++;
                            
                                                        }
                            
                                                    }
                            
                                                    // second patch graph QL
                                                    
                                                    console.log(userObject)
                            
                                                    iCountLoop++;
                            
                                                }
                            
                                                if(v['$anti_abuse_metadata'] !== undefined){
                            
                                                    // console.log(v);
                            
                                                    userObject = {};
                                                    userObject['company_size'] = '';
                                                    userObject['domain'] = '';
                                                    userObject['founded'] = '';
                                                    userObject['industry'] = '';
                                                    userObject['job_title'] = '';
                                                    userObject['linkedin_id'] = '';
                                                    userObject['past_company'] = '';
                                                    userObject['rewards'] = '';
                                                    userObject['skills'] = '';
                                                    userObject['type'] = '';
                                                    userObject['user__summary__experience'] = '';
                                                    userObject['user_city'] = '';
                                                    userObject['user_company_id'] = '';
                                                    userObject['user_company_name'] = '';
                                                    userObject['user_first_name'] = '';
                                                    userObject['user_keywords'] = '';
                                                    userObject['user_last_name'] = '';
                                                    userObject['user_number_connections'] = '';
                                                    userObject['user_other_email'] = '';
                                                    userObject['user_profile_picture'] = '';
                                                    userObject['user_source'] = 'linkedin';
                                                    userObject['user_summary'] = '';
                                                    userObject['user_url'] = '';
                                                    userObject['vcard'] = '';
                                                    userObject['website'] = '';
                            
                                                    // console.log('Matched new update lazy 3');
                            
                                                    if(v['headline'] !== undefined){
                                                        userObject['user_company_name'] = InterceptorcleanCompanyName(InterceptorCompanyPremium(v['headline']));
                                                    }else {
                                                        companyNameSearch = '';
                                                    }
                            
                                                    if(v['headline'] !== undefined){
                                                        userObject['job_title'] = InterceptorUnescapeHtml(v['headline']);
                                                    }
                            
                                                    if(v['firstName'] !== undefined){
                                                        
                                                        userObject['user_first_name'] = InterceptorcleanNameComma(v['firstName']);
                                                        
                                                    }
                            
                                                    if(v['lastName'] !== undefined){
                                                        
                                                        userObject['user_last_name'] = InterceptorcleanNameComma(v['lastName']);
                                                        
                                                    }
                            
                                                    if(v['trackingUrn'] !== undefined){
                                                        userObject['linkedin_id'] = InterceptorextractIdNewLinkedin(v['trackingUrn']);
                                                    }
                            
                                                    if(v['publicIdentifier'] !== undefined){
                                                        userObject['user_url'] = 'https://linkedin.com/in/'+v['publicIdentifier'];
                                                    }
                            
                                                    if(v['$anti_abuse_metadata'] !== undefined){
                            
                                                        if(v['$anti_abuse_metadata']['/lastName'] !== undefined){
                            
                                                            if(v['$anti_abuse_metadata']['/lastName']['sourceUrns'] !== undefined){
                            
                                                                console.log('found linkedin id: '+userObject['user_first_name']);
                                                                if(v['$anti_abuse_metadata']['/lastName']['sourceUrns']['com.linkedin.common.urn.MemberUrn'] !== undefined){
                            
                                                                    userObject['linkedin_id'] = InterceptorextractIdNewLinkedin(v['$anti_abuse_metadata']['/lastName']['sourceUrns']['com.linkedin.common.urn.MemberUrn']);
                            
                                                                }
                            
                                                            }
                            
                                                        }
                            
                                                    }
                            
                                                    //
                            
                                                    if(document.querySelector('[data-chameleon-result-urn="urn:li:member:'+userObject['linkedin_id']+'"]')){
                            
                                                        // console.log('Found element row id: '+userObject['linkedin_id'])
                            
                                                        selectorViewRowNew = document.querySelector('[data-chameleon-result-urn="urn:li:member:'+userObject['linkedin_id']+'"]');
                            
                                                        if(selectorViewRowNew.getElementsByClassName("entity-result__secondary-subtitle")[0]){
                            
                                                            cityText = selectorViewRowNew.getElementsByClassName("entity-result__secondary-subtitle")[0].innerText;
                            
                                                            userObject['user_city'] = cityText;
                            
                                                        }
                            
                                                    }
                                
                                                    if(userObject['linkedin_id'] !== ''){
                            
                                                        allProfiles[userObject['linkedin_id']] = userObject;
                            
                                                    }
                                                    
                                                    console.log(userObject)
                            
                                                    iCountLoop++;
                                                
                            
                                                }
                            
                                            });
                            
                                            if(Object.keys(allProfiles).length > 0){
                                                console.log('setting local storage');
                                                console.log('Local storage 3 size: ' + Object.keys(allProfiles).length);
                                                console.log(allProfiles);
                                                console.log('Local storage 3');
                                                window.postMessage({
                                                    source: 'my-extension',
                                                    type: 'SAVE_PROFILES',
                                                    data: allProfiles
                                                }, '*');
                                                localStorage.setItem("INTERCEPTOR3837383", JSON.stringify(allProfiles));
                                            }
                            
                            
                                        }
                            
                                    }

                                    /////// premium code


                                } catch (error) {
                                    console.error("Error parsing JSON:", error);
                                }
                            });
                        } else {
                            console.warn("Response is not a Blob:", this.response);
                        }

                    }

                }
            });
            return send.apply(this, arguments);
        };

    })(XMLHttpRequest);

}

// let targets = [
//     "www.linkedin.com/sales-api/salesApiProfiles",
//     "www.linkedin.com/sales/profile/",
//     "www.linkedin.com/connected/api/v1/contacts",
// 	"www.linkedin.com/sales-api/salesApiPeopleSearch",
// 	"www.linkedin.com/sales-api/salesApiLeadSearch",
//     "www.linkedin.com/connected/api/v2/contacts",
//     "www.linkedin.com/sales-api/salesApiMessagingThreads",
//     "www.linkedin.com/communities-api/v1/memberships/community",
//     "www.linkedin.com/sales/search/results",
//     "www.linkedin.com/voyager/api/",
//     "www.linkedin.com/recruiter/api/smartsearch",
//     "www.linkedin.com/sales-api/salesApiMailbox"
// ];

// try {
//     let OldFetch = window.fetch;
//     window.fetch = function () {
//         return new Promise((resolve, reject) => {
//             OldFetch.apply(this, arguments).then(async (response) => {
//                 if (response.ok) {
//                     let res = response.clone();
//                     res.text().then(t => handleRequests(res, t)).catch(e => { });
//                 }
//                 resolve(response);
//             }).catch((error) => reject())
//         });
//     }
// } catch (error) {

// }
// async function handleRequests(response, res) {
//     var resp = {};
//     try {
//         resp.data = res;
//         resp.type = response.type;
//         resp.url = response.url;
//         if (typeof resp.url != "undefined" && targets.filter(target => resp.url.indexOf(target) > -1).length > 0) {
            
//             if(
// 				resp.url.indexOf('salesApiPeopleSearch') !== -1 ||
// 				resp.url.indexOf('salesApiLeadSearch') !== -1
// 			){

// 				jsonProfiles = JSON.parse(resp.data);

// 				console.log(jsonProfiles)

// 				///
// 					allProfiles = {};

// 					if(jsonProfiles['elements'] !== undefined){

// 						// $.each(jsonProfiles['elements'], function( k, v ) {

// 						jsonProfiles['elements'].forEach(function(v) {

// 							// console.log(v);

// 							userObject = {};
// 							userObject['company_size'] = '';
// 							userObject['domain'] = '';
// 							userObject['founded'] = '';
// 							userObject['industry'] = '';
// 							userObject['job_title'] = '';
// 							userObject['linkedin_id'] = '';
// 							userObject['past_company'] = '';
// 							userObject['rewards'] = '';
// 							userObject['skills'] = '';
// 							userObject['type'] = '';
// 							userObject['user__summary__experience'] = '';
// 							userObject['user_city'] = '';
// 							userObject['user_company_id'] = '';
// 							userObject['user_company_name'] = '';
// 							userObject['user_first_name'] = '';
// 							userObject['user_keywords'] = '';
// 							userObject['user_last_name'] = '';
// 							userObject['user_number_connections'] = '';
// 							userObject['user_other_email'] = '';
// 							userObject['user_profile_picture'] = '';
// 							userObject['user_source'] = 'linkedin';
// 							userObject['user_summary'] = '';
// 							userObject['user_url'] = '';
// 							userObject['vcard'] = '';
// 							userObject['website'] = '';

// 							if(v['currentPositions'] !== undefined && v['currentPositions']['companyName'] !== undefined){
// 								userObject['user_company_name'] = InterceptorcleanCompanyName(v['currentPositions']['companyName']);
// 							}

// 							if(v['currentPositions'] !== undefined && v['currentPositions']['companyUrn'] !== undefined){
// 								userObject['user_company_id'] = InterceptorextractIdNewLinkedinCompany(v['currentPositions']['companyUrn']);
// 							}

// 							if(v['geoRegion'] !== undefined && v['geoRegion'] !== undefined){
// 								userObject['user_city'] = v['geoRegion'];
// 							}

// 							if(v['currentPositions'] !== undefined && v['currentPositions']['title'] !== undefined){
// 								userObject['job_title'] = InterceptorUnescapeHtml(v['currentPositions']['title']);
// 							}

// 							if(v['firstName'] !== undefined){
// 								userObject['user_first_name'] = InterceptorcleanNameComma(v['firstName']);
// 							}

// 							if(v['lastName'] !== undefined){
// 								userObject['user_last_name'] = InterceptorcleanNameComma(v['lastName']);
// 							}

// 							if(v['objectUrn'] !== undefined){
// 								userObject['linkedin_id'] = InterceptorextractIdNewLinkedin(v['objectUrn']);
// 							}
							
// 							if(v['currentPositions'] !== undefined && v['currentPositions']['companyName'] !== undefined){
// 								companyNameSearch = v['currentPositions']['companyName'];
// 							}else {
// 								companyNameSearch = '';
// 							}

// 							if(v['currentPositions'] !== undefined && v['currentPositions'].length > 0){


// 												for (var index = 0; index < v['currentPositions'].length; index++) {
// 													var element = v['currentPositions'][index];

// 													if(element['current'] !== undefined && element['current'] === true){

// 														if(element['title'] !== undefined){

// 															userObject['job_title'] = InterceptorUnescapeHtml(element['title']);
														

// 														}

// 														if(element['companyName'] !== undefined){

// 															userObject['user_company_name'] = InterceptorcleanCompanyName(element['companyName']);
// 															companyNameSearch = element['companyName'];

// 														}

// 														if(element['companyUrn'] !== undefined){

// 															userObject['user_company_id'] = InterceptorextractIdNewLinkedinCompany(element['companyUrn']);

// 														}

// 													}
													
// 												}

// 							}

// 							if(v['entityUrn'] !== undefined){
// 								userObject['user_url'] = v['entityUrn'].toString().replace('urn:li:fs_salesProfile:(', 'https://www.linkedin.com/sales/people/')
// 								userObject['user_url'] = userObject['user_url'].replace(',ibn_)', '');
// 								userObject['user_url'] = userObject['user_url'].replace(')', '');

// 							}

// 							if(userObject['linkedin_id'] !== ''){
// 								allProfiles[userObject['linkedin_id']] = userObject;
// 							}

// 							console.log(userObject);

// 						});



// 						localStorage.setItem("INTERCEPTOR3837383", JSON.stringify(allProfiles));



// 					}
				
// 				///


//             }
            
//             let resevent = new CustomEvent("datachannel", {
//                 detail: resp
//             });
//             //document.dispatchEvent(resevent)
//         }
//     } catch (e) { }
// }




String.prototype.InterceptorReplaceAllX = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
    };
    
    
    
    
    
    
    
    function isNumeric(num){
    return !isNaN(num)
    }
    
    function InterceptorcleanName(string){
    
        string2 = string.InterceptorReplaceAllX('- ', '').toString();
    
        string3 = string2.toString().replace('.', '');
        string3 = string3.toString().replace('. ', '');
    
        words_name = string3.split(" ");
    
        names__array = [];
    
        names__array.push(words_name[0]);
    
        if(words_name[2] != undefined && words_name[3] != undefined){
        names__array.push(words_name[1]+"-"+words_name[2]+"-"+words_name[3]);
        }else if(words_name[2] != undefined) {
        names__array.push(words_name[1]+"-"+words_name[2]);
        }else {
        names__array.push(words_name[1]);       
        }
    
        return names__array;
    
    }
    
    function InterceptorcleanCompanyName(string){
        
            string = string.replace(', Inc.', '')
            string = string.replace(' Inc.', '')
            string = string.replace(' Inc', '')
            string = string.replace(' LLC', '')
            string = string.replace(', LLC', '')
            string = string.trim();
            string = string.replace('<b>', '');
            string = string.replace('</b>', '');
        
            string = string.replace('&lt;b&gt;', '');
            string = string.replace('&lt;/b&gt;', '');
    
            string = string.replace(', INC.', '');
    
            return string;
    
    }
    
    function InterceptorCompanyPremium(string){
    
        companyName = '';
    
        if(string.indexOf('at ') !== -1){
        string = string.split('at ');
        companyName = string[1];
        }
    
        if(string.indexOf('chez ') !== -1){
        string = string.split('chez ');
        companyName = string[1];
        }
    
        if(string.indexOf('en ') !== -1){
        string = string.split('en ');
        companyName = string[1];
        }
    
        if(companyName.indexOf('- ') !== -1){
        companyName = companyName.split('- ');
        companyName = companyName[0];
        }
    
        if(companyName.indexOf('| ') !== -1){
        companyName = companyName.split('| ');
        companyName = companyName[0];
        }
    
        companyName = companyName.trim();
    
        return companyName;
    
    }
    
    function InterceptorextractIdNewLinkedinCompany(str){
    
        extract_id = str.replace("urn:li:fs_salesCompany:", "");
    
        return extract_id;
    
    }
    
    function InterceptorextractIdNewLinkedin(str){
    
        extract_id = str.replace("urn:li:member:", "");
    
        return extract_id;
    
    }
    
    function InterceptorCleanLinkedinPublicUrl(url){
    
        if(url.indexOf('?') !== -1){
    
            urlObject = url.split('?');
            if(urlObject[0] !== undefined){
                url = urlObject[0];
            }
    
        }
    
        return url;
    
    }
    
    function InterceptorUnescapeHtml(safe) {
    
    var tmp = document.createElement("DIV");
    tmp.innerHTML = safe;
    vrs =  tmp.textContent || tmp.innerText || "";
    vrs = vrs.replace(/<(?:.|\n)*?>/gm, '')
    return vrs;
    }
    
    
    function InterceptorcleanNameComma(string){
    
        if(string === undefined){
        return '';
        }
    
        if(string.indexOf(',') > -1){
    
        string = string.split(',');
        string = string[0]
    
    }
    
    return string;
    
    }


// String.prototype.InterceptorReplaceAllX = function(search, replacement) {
// 	var target = this;
// 	return target.replace(new RegExp(search, 'g'), replacement);
// 	};
	
	
	
	
	
	
	
// 	function isNumeric(num){
// 	return !isNaN(num)
// 	}
	
// 	function InterceptorcleanName(string){
	
// 		string2 = string.InterceptorReplaceAllX('- ', '').toString();
	
// 		string3 = string2.toString().replace('.', '');
// 		string3 = string3.toString().replace('. ', '');
	
// 		words_name = string3.split(" ");
	
// 		names__array = [];
	
// 		names__array.push(words_name[0]);
	
// 		if(words_name[2] != undefined && words_name[3] != undefined){
// 		names__array.push(words_name[1]+"-"+words_name[2]+"-"+words_name[3]);
// 		}else if(words_name[2] != undefined) {
// 		names__array.push(words_name[1]+"-"+words_name[2]);
// 		}else {
// 		names__array.push(words_name[1]);       
// 		}
	
// 		return names__array;
	
// 	}
	
// 	function InterceptorcleanCompanyName(string){
		
// 			string = string.replace(', Inc.', '')
// 			string = string.replace(' Inc.', '')
// 			string = string.replace(' Inc', '')
// 			string = string.replace(' LLC', '')
// 			string = string.replace(', LLC', '')
// 			string = string.trim();
// 			string = string.replace('<b>', '');
// 			string = string.replace('</b>', '');
		
// 			string = string.replace('&lt;b&gt;', '');
// 			string = string.replace('&lt;/b&gt;', '');
	
// 			string = string.replace(', INC.', '');
	
// 			return string;
	
// 	}
	
// 	function InterceptorCompanyPremium(string){
	
// 		companyName = '';
	
// 		if(string.indexOf('at ') !== -1){
// 		string = string.split('at ');
// 		companyName = string[1];
// 		}
	
// 		if(string.indexOf('chez ') !== -1){
// 		string = string.split('chez ');
// 		companyName = string[1];
// 		}
	
// 		if(string.indexOf('en ') !== -1){
// 		string = string.split('en ');
// 		companyName = string[1];
// 		}
	
// 		if(companyName.indexOf('- ') !== -1){
// 		companyName = companyName.split('- ');
// 		companyName = companyName[0];
// 		}
	
// 		if(companyName.indexOf('| ') !== -1){
// 		companyName = companyName.split('| ');
// 		companyName = companyName[0];
// 		}
	
// 		companyName = companyName.trim();
	
// 		return companyName;
	
// 	}
	
// 	function InterceptorextractIdNewLinkedinCompany(str){
	
// 		extract_id = str.replace("urn:li:fs_salesCompany:", "");
	
// 		return extract_id;
	
// 	}
	
// 	function InterceptorextractIdNewLinkedin(str){
	
// 		extract_id = str.replace("urn:li:member:", "");
	
// 		return extract_id;
	
// 	}
	
// 	function InterceptorUnescapeHtml(safe) {
	
// 	var tmp = document.createElement("DIV");
// 	tmp.innerHTML = safe;
// 	vrs =  tmp.textContent || tmp.innerText || "";
// 	vrs = vrs.replace(/<(?:.|\n)*?>/gm, '')
// 	return vrs;
// 	}
	
	
// 	function InterceptorcleanNameComma(string){
	
// 		if(string === undefined){
// 		return '';
// 		}
	
// 		if(string.indexOf(',') > -1){
	
// 		string = string.split(',');
// 		string = string[0]
	
// 	}
	
// 	return string;
	
// 	}
	
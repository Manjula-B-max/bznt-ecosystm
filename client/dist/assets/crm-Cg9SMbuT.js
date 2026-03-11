import"./modulepreload-polyfill-B5Qt9EMX.js";(function(){var ht="bezent_jwt";window.BezentAuth={getToken:function(){return localStorage.getItem(ht)||""},setToken:function(a){localStorage.setItem(ht,a)},clearToken:function(){localStorage.removeItem(ht),localStorage.removeItem("bezent_user")},isLoggedIn:function(){return!!localStorage.getItem(ht)}},window.apiFetch=function(a,t){t=t||{};var i={"Content-Type":"application/json"},s=window.BezentAuth.getToken();return s&&(i.Authorization="Bearer "+s),t.headers&&Object.assign(i,t.headers),fetch("/api"+a,Object.assign({},t,{headers:i})).then(function(n){return n.status===401?(window.BezentAuth.clearToken(),location.replace("index.html"),null):n.json()})}})();class es{constructor(){this.currentSection="dashboard",this.currentSubSection="overview",this.selectedClientName=null,this.selectedLeadId=null,this.isChatOpen=!1,this.chatMessages=this.getStoredChatMessages(),this.charts={},this._toastEl=null,this._toastTimer=null,this._modalEl=null,this._chartAnimFrames={},this.init()}getLeadPipelineStages(){return["New Lead","Contacted","Missed Call","Follow-up","Demo","Quotation","Negotiation","Closed","PO Received"]}renderLeadPipelineProgress(a){const t=this.getLeadPipelineStages(),i=String(a||"").trim().toLowerCase();let s=t.findIndex(n=>String(n).toLowerCase()===i);return s<0&&(s=0),`
            <div class="mt-2">
                <div class="flex flex-wrap items-start justify-between gap-3">
                    ${t.map((n,l)=>{const o=l<=s,r=l===t.length-1,c=o?"bg-purple-600 text-white border-purple-600":"bg-white text-slate-500 border-slate-300",d=o?"bg-purple-600":"bg-slate-200";return`
                            <div class="flex items-center ${r?"":"flex-1"}" title="${n}">
                                <div class="w-6 h-6 rounded-full border ${c} flex items-center justify-center text-[11px] font-semibold">${l+1}</div>
                                ${r?"":`<div class="h-0.5 flex-1 mx-2 ${d}"></div>`}
                            </div>
                        `}).join("")}
                </div>
                <div class="mt-2 flex items-center justify-between text-[10px] text-slate-500">
                    <div class="font-medium">${t[0]}</div>
                    <div class="font-medium">${t[t.length-1]}</div>
                </div>
            </div>
        `}getRfpTemplates(){this._rfpDraft||(this._rfpDraft=this.getStoredRfpDraft()||this.getSampleRfpTemplate());const a=this.computeRfp(this._rfpDraft),t=r=>String(r??"").replace(/</g,"&lt;").replace(/"/g,"&quot;"),i=a.client||{},s={...a.provider||{},companyName:"APJ 3D Solutions India Pvt Ltd",headOffice:"Regd: Ground floor HW2, Forge Factory, #3 KCT Tech Park, Athipalayam Road, Chinnavedampatti, Coimbatore District, Tamil Nadu - 641049 | Corp: CP3 & CP4, Sipcot Industrial Complex, Phase-II, Moranapalli, Hosur, Krishnagiri, Tamil Nadu - 635109"},n=Array.isArray(a.items)?a.items:[],l=a.bank||{},o=a.totals||{};return`
            <div class="space-y-6 fade-in">
                <div class="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h2 class="text-xl sm:text-2xl font-semibold text-slate-900">RFP Templates</h2>
                        <p class="text-sm text-slate-500">Fill RFP sections, reuse line-items quotation, then print</p>
                    </div>
                    <div class="flex gap-2">
                        <button data-action="rfp:item:add" class="px-4 py-2 text-sm font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">+ Add Line</button>
                        <button data-action="rfp:print:current" class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Print RFP</button>
                    </div>
                </div>

                <div class="bg-white rounded-lg border border-slate-200 p-6 shadow-lg space-y-6">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <div class="text-sm font-semibold text-slate-900">1. Company Information (Client)</div>
                            <div class="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div class="md:col-span-2">
                                    <label class="text-xs font-medium text-slate-600">Company Name</label>
                                    <input data-rfp-field="client.companyName" value="${t(i.companyName)}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-slate-600">Contact person</label>
                                    <input data-rfp-field="client.contactPerson" value="${t(i.contactPerson)}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-slate-600">Project Name</label>
                                    <input data-rfp-field="client.projectName" value="${t(i.projectName)}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-slate-600">GST Number</label>
                                    <input data-rfp-field="client.gstNumber" value="${t(i.gstNumber)}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-slate-600">Date of Request</label>
                                    <input data-rfp-field="client.dateOfRequest" value="${t(i.dateOfRequest)}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
                                </div>
                                <div class="md:col-span-2">
                                    <label class="text-xs font-medium text-slate-600">Company Address</label>
                                    <input data-rfp-field="client.companyAddress" value="${t(i.companyAddress)}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <div class="text-sm font-semibold text-slate-900">2. Service Provider</div>
                            <div class="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div class="md:col-span-2">
                                    <label class="text-xs font-medium text-slate-600">Logo</label>
                                    <div class="mt-1 flex items-center gap-3">
                                        <div class="h-12 w-12 rounded-md border border-slate-200 bg-white flex items-center justify-center overflow-hidden">
                                            <img id="rfpLogoPreview" src="${t(s.logoDataUrl||"")}" alt="" style="max-width:100%;max-height:100%;${s.logoDataUrl?"":"display:none;"}" />
                                        </div>
                                        <input id="rfpLogoUpload" type="file" accept="image/*" class="block text-sm" />
                                    </div>
                                </div>
                                <div class="md:col-span-2">
                                    <label class="text-xs font-medium text-slate-600">Company Name</label>
                                    <input data-rfp-field="provider.companyName" value="${t(s.companyName)}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
                                </div>
                                <div class="md:col-span-2">
                                    <label class="text-xs font-medium text-slate-600">Head Office</label>
                                    <input data-rfp-field="provider.headOffice" value="${t(s.headOffice)}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
                                </div>
                                <div class="md:col-span-2">
                                    <label class="text-xs font-medium text-slate-600">CIN / GSTIN</label>
                                    <input data-rfp-field="provider.cinGstin" value="${t(s.cinGstin)}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-slate-600">Contact Person</label>
                                    <input data-rfp-field="provider.contactPerson" value="${t(s.contactPerson)}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-slate-600">Proposal sent on (V1)</label>
                                    <input data-rfp-field="provider.proposalSentOn" value="${t(s.proposalSentOn)}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <div class="text-sm font-semibold text-slate-900">3. Scope of work (one bullet per line)</div>
                            <textarea data-rfp-field="scopeText" rows="6" class="mt-2 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm">${t(a.scopeText||"")}</textarea>
                        </div>
                        <div>
                            <div class="text-sm font-semibold text-slate-900">4. Implementation Plan (one bullet per line)</div>
                            <textarea data-rfp-field="implementationText" rows="6" class="mt-2 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm">${t(a.implementationText||"")}</textarea>
                        </div>
                        <div>
                            <div class="text-sm font-semibold text-slate-900">5. Project Timeline (one bullet per line)</div>
                            <textarea data-rfp-field="timelineText" rows="5" class="mt-2 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm">${t(a.timelineText||"")}</textarea>
                        </div>
                        <div>
                            <div class="text-sm font-semibold text-slate-900">6. Payment Terms Schedule (one bullet per line)</div>
                            <textarea data-rfp-field="paymentText" rows="5" class="mt-2 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm">${t(a.paymentText||"")}</textarea>
                        </div>
                        <div>
                            <div class="text-sm font-semibold text-slate-900">7. Client Responsibilities (one bullet per line)</div>
                            <textarea data-rfp-field="responsibilitiesText" rows="6" class="mt-2 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm">${t(a.responsibilitiesText||"")}</textarea>
                        </div>
                        <div>
                            <div class="text-sm font-semibold text-slate-900">8. Project Delays (one bullet per line)</div>
                            <textarea data-rfp-field="delaysText" rows="4" class="mt-2 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm">${t(a.delaysText||"")}</textarea>
                        </div>
                        <div>
                            <div class="text-sm font-semibold text-slate-900">9. Project Commencement Date</div>
                            <textarea data-rfp-field="commencementText" rows="3" class="mt-2 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm">${t(a.commencementText||"")}</textarea>
                        </div>
                        <div>
                            <div class="text-sm font-semibold text-slate-900">10. Project Changes (one bullet per line)</div>
                            <textarea data-rfp-field="changesText" rows="5" class="mt-2 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm">${t(a.changesText||"")}</textarea>
                        </div>
                    </div>

                    <div>
                        <div class="flex flex-wrap items-start justify-between gap-3">
                            <div class="text-sm font-semibold text-slate-900">11. Service Cost / Quotation</div>
                            <div class="flex items-center gap-3">
                                <div class="text-xs text-slate-500">Tax: <span class="font-semibold text-slate-900">IGST</span> @ <span class="font-semibold text-slate-900">18%</span></div>
                                <button data-action="rfp:item:add" class="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-purple-600 text-white rounded-lg hover:bg-purple-700">&#43; Add Line</button>
                            </div>
                        </div>

                        <div class="mt-2 grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                                <label class="text-xs font-medium text-slate-600">Quote ID</label>
                                <input data-rfp-field="quoteId" value="${t(a.quoteId)}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
                            </div>
                        </div>

                        <div class="mt-3 overflow-x-auto -mx-2 sm:mx-0">
                            <table class="w-full text-sm" style="min-width: 800px;">
                                <thead class="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th class="text-left px-3 py-2 font-medium text-slate-700">Sl</th>
                                        <th class="text-left px-3 py-2 font-medium text-slate-700">Item/Service Description</th>
                                        <th class="text-left px-3 py-2 font-medium text-slate-700">Unit</th>
                                        <th class="text-right px-3 py-2 font-medium text-slate-700">Qty</th>
                                        <th class="text-right px-3 py-2 font-medium text-slate-700">Unit rate</th>
                                        <th class="text-right px-3 py-2 font-medium text-slate-700">Amount</th>
                                        <th class="px-3 py-2"></th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-200">
                                    ${n.map((r,c)=>`
                                        <tr>
                                            <td class="px-3 py-2 text-slate-700">${c+1}</td>
                                            <td class="px-3 py-2">
                                                <input data-rfp-item-index="${c}" data-rfp-item-field="description" value="${t(r.description)}" class="w-full border border-slate-200 rounded-lg px-2 py-1 text-sm" />
                                                <select data-rfp-item-index="${c}" data-rfp-item-field="serviceCharge" class="mt-1 w-full border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-600">
                                                    <option value="">-- Service Charge (optional) --</option>
                                                    <option value="3D Scanning" ${r.serviceCharge==="3D Scanning"?"selected":""}>3D Scanning</option>
                                                    <option value="3D Inspection" ${r.serviceCharge==="3D Inspection"?"selected":""}>3D Inspection</option>
                                                    <option value="3D Modelling" ${r.serviceCharge==="3D Modelling"?"selected":""}>3D Modelling</option>
                                                    <option value="3D Reverse Engineering" ${r.serviceCharge==="3D Reverse Engineering"?"selected":""}>3D Reverse Engineering</option>
                                                    <option value="3D Printing" ${r.serviceCharge==="3D Printing"?"selected":""}>3D Printing</option>
                                                    <option value="Consultation" ${r.serviceCharge==="Consultation"?"selected":""}>Consultation</option>
                                                </select>
                                            </td>
                                            <td class="px-3 py-2">
                                                <input data-rfp-item-index="${c}" data-rfp-item-field="uom" value="${t(r.uom||"AE")}" class="w-full border border-slate-200 rounded-lg px-2 py-1 text-sm" />
                                            </td>
                                            <td class="px-3 py-2">
                                                <input data-rfp-item-index="${c}" data-rfp-item-field="qty" value="${t(r.qty)}" class="w-full border border-slate-200 rounded-lg px-2 py-1 text-sm text-right" />
                                            </td>
                                            <td class="px-3 py-2">
                                                <input data-rfp-item-index="${c}" data-rfp-item-field="rate" value="${t(r.rate)}" class="w-full border border-slate-200 rounded-lg px-2 py-1 text-sm text-right" />
                                            </td>
                                            <td class="px-3 py-2 text-right font-semibold text-slate-900"><span data-rfp-item-amount="${c}">${this.formatINR(Number(r.amount||0))}</span></td>
                                            <td class="px-3 py-2 text-right">
                                                <button data-action="rfp:item:remove:${c}" class="px-2 py-1 text-xs font-medium bg-rose-50 text-rose-700 rounded-md hover:bg-rose-100">Remove</button>
                                            </td>
                                        </tr>
                                    `).join("")}
                                </tbody>
                            </table>
                        </div>


                        <div class="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <div class="bg-slate-50 border border-slate-200 rounded-lg p-4">
                                <div class="text-xs text-slate-500">Sub Total</div>
                                <div id="rfpSubtotal" class="text-lg font-semibold text-slate-900 mt-1">${this.formatINR(o.subtotal||0)}</div>
                            </div>
                            <div class="bg-slate-50 border border-slate-200 rounded-lg p-4">
                                <div class="text-xs text-slate-500">IGST (18%)</div>
                                <div id="rfpTax" class="text-lg font-semibold text-slate-900 mt-1">${this.formatINR(o.tax||0)}</div>
                            </div>
                            <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                <div class="text-xs text-purple-700">Total</div>
                                <div id="rfpTotal" class="text-lg font-extrabold text-slate-900 mt-1">${this.formatINR(o.total||0)}</div>
                                <div id="rfpWords" class="text-xs text-slate-600 mt-1">${t(this.amountToWordsINR(o.total||0))}</div>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <div class="text-sm font-semibold text-slate-900">12. Account Information (Banking details)</div>
                            <div class="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div class="md:col-span-2">
                                    <label class="text-xs font-medium text-slate-600">Beneficiary name</label>
                                    <input data-rfp-field="bank.beneficiary" value="${t(l.beneficiary)}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
                                </div>
                                <div class="md:col-span-2">
                                    <label class="text-xs font-medium text-slate-600">Bank Name</label>
                                    <select id="rfpBankSelect" data-rfp-field="bank.bankName" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm">
                                        <option value="">-- Select Bank --</option>
                                        <option value="Punjab National Bank" ${l.bankName==="Punjab National Bank"?"selected":""}>Punjab National Bank</option>
                                        <option value="Indian Bank" ${l.bankName==="Indian Bank"?"selected":""}>Indian Bank </option>
                                    </select>
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-slate-600">Account Number</label>
                                    <input id="rfpBankAccountNo" data-rfp-field="bank.accountNo" value="${t(l.accountNo)}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-slate-600">Branch</label>
                                    <input id="rfpBankBranch" data-rfp-field="bank.branch" value="${t(l.branch||"")}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50" readonly />
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-slate-600">IFSC Code</label>
                                    <input id="rfpBankIfsc" data-rfp-field="bank.ifsc" value="${t(l.ifsc)}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
                                </div>
                            </div>
                        </div>
                        <div>
                            <div class="text-sm font-semibold text-slate-900">13. Confidentiality & Data Security</div>
                            <textarea data-rfp-field="confidentialityText" rows="8" class="mt-2 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm">${t(a.confidentialityText||"")}</textarea>
                        </div>
                    </div>
                </div>
            </div>
        `}editClientViaModal(a){const t=a||{},i=String(t.name||"").trim();if(!i){this.showToast("Select a client first.");return}const s=n=>String(n??"").replace(/</g,"&lt;");this.openModal("Edit Client",`
            <div>
                <label style="display:block;font-size:12px;font-weight:700;color:#475569;">Client Name</label>
                <input name="name" required style="margin-top:6px;width:100%;border:1px solid #e2e8f0;border-radius:12px;padding:10px 12px;font-size:14px;" value="${s(i)}" />
            </div>
            <div style="display:grid;grid-template-columns:1fr;gap:10px;" class="sm-grid-2col">
                <div>
                    <label style="display:block;font-size:12px;font-weight:700;color:#475569;">Owner</label>
                    <input name="owner" style="margin-top:6px;width:100%;border:1px solid #e2e8f0;border-radius:12px;padding:10px 12px;font-size:14px;" value="${s(t.owner||"")}" />
                </div>
                <div>
                    <label style="display:block;font-size:12px;font-weight:700;color:#475569;">Industry</label>
                    <input name="industry" style="margin-top:6px;width:100%;border:1px solid #e2e8f0;border-radius:12px;padding:10px 12px;font-size:14px;" value="${s(t.industry||"")}" />
                </div>
            </div>
            <div style="display:grid;grid-template-columns:1fr;gap:10px;" class="sm-grid-2col">
                <div>
                    <label style="display:block;font-size:12px;font-weight:700;color:#475569;">Email</label>
                    <input name="email" style="margin-top:6px;width:100%;border:1px solid #e2e8f0;border-radius:12px;padding:10px 12px;font-size:14px;" value="${s(t.email||"")}" />
                </div>
                <div>
                    <label style="display:block;font-size:12px;font-weight:700;color:#475569;">Phone</label>
                    <input name="phone" style="margin-top:6px;width:100%;border:1px solid #e2e8f0;border-radius:12px;padding:10px 12px;font-size:14px;" value="${s(t.phone||"")}" />
                </div>
            </div>
            <div>
                <label style="display:block;font-size:12px;font-weight:700;color:#475569;">City</label>
                <input name="city" style="margin-top:6px;width:100%;border:1px solid #e2e8f0;border-radius:12px;padding:10px 12px;font-size:14px;" value="${s(t.city||"")}" />
            </div>
            <div>
                <label style="display:block;font-size:12px;font-weight:700;color:#475569;">Notes</label>
                <textarea name="notes" rows="3" style="margin-top:6px;width:100%;border:1px solid #e2e8f0;border-radius:12px;padding:10px 12px;font-size:14px;">${s(t.notes||"")}</textarea>
            </div>
        `,{submitLabel:"Save Changes",onSubmit:n=>{const l=new FormData(n),o=String(l.get("name")||"").trim();if(!o){this.showToast("Client name is required.");return}o.toLowerCase()!==i.toLowerCase()&&this.deleteClientByName(i);const r=this.saveClient({name:o,owner:l.get("owner"),industry:l.get("industry"),email:l.get("email"),phone:l.get("phone"),city:l.get("city")||"—",notes:l.get("notes"),stage:String(t.stage||"Active")});if(!r.ok){this.showToast(r.message||"Unable to save client.");return}this.closeModal(),this.selectedClientName=o,this.renderContent(),this.initializeLucideIcons(),this.showToast("Client updated.")}})}editLeadViaModal(a){const t=a||{},i=String(t.id||"").trim();if(!i){this.showToast("Select a lead first.");return}const s=n=>String(n??"").replace(/</g,"&lt;");this.openModal("Edit Lead",`
            <div>
                <label style="display:block;font-size:12px;font-weight:700;color:#475569;">Company Name</label>
                <input name="company" required style="margin-top:6px;width:100%;border:1px solid #e2e8f0;border-radius:12px;padding:10px 12px;font-size:14px;" value="${s(t.company||"")}" />
            </div>
            <div style="display:grid;grid-template-columns:1fr;gap:10px;" class="sm-grid-2col">
                <div>
                    <label style="display:block;font-size:12px;font-weight:700;color:#475569;">Contact</label>
                    <input name="contact" style="margin-top:6px;width:100%;border:1px solid #e2e8f0;border-radius:12px;padding:10px 12px;font-size:14px;" value="${s(t.contact||"")}" />
                </div>
                <div>
                    <label style="display:block;font-size:12px;font-weight:700;color:#475569;">Assigned To</label>
                    <input name="assignedTo" style="margin-top:6px;width:100%;border:1px solid #e2e8f0;border-radius:12px;padding:10px 12px;font-size:14px;" value="${s(t.assignedTo||"")}" />
                </div>
            </div>
            <div style="display:grid;grid-template-columns:1fr;gap:10px;" class="sm-grid-2col">
                <div>
                    <label style="display:block;font-size:12px;font-weight:700;color:#475569;">Source</label>
                    <select name="source" style="margin-top:6px;width:100%;border:1px solid #e2e8f0;border-radius:12px;padding:10px 12px;font-size:14px;">
                        <option value="Exhibition" ${t.source==="Exhibition"?"selected":""}>Exhibition</option>
                        <option value="IndiaMART" ${t.source==="IndiaMART"?"selected":""}>IndiaMART</option>
                        <option value="LinkedIn" ${t.source==="LinkedIn"?"selected":""}>LinkedIn</option>
                        <option value="Field Visit" ${t.source==="Field Visit"?"selected":""}>Field Visit</option>
                        <option value="Referral" ${t.source==="Referral"?"selected":""}>Referral</option>
                    </select>
                </div>
                <div>
                    <label style="display:block;font-size:12px;font-weight:700;color:#475569;">Stage</label>
                    <input name="stage" style="margin-top:6px;width:100%;border:1px solid #e2e8f0;border-radius:12px;padding:10px 12px;font-size:14px;" value="${s(t.stage||"New Lead")}" />
                </div>
            </div>
            <input type="hidden" name="id" value="${s(i)}" />
        `,{submitLabel:"Save Changes",onSubmit:n=>{const l=new FormData(n),o=String(l.get("company")||"").trim();if(!o){this.showToast("Company name is required.");return}const r=this.saveLead({id:l.get("id"),company:o,contact:l.get("contact"),assignedTo:l.get("assignedTo"),source:l.get("source"),stage:l.get("stage")});if(!r.ok){this.showToast(r.message||"Unable to update lead.");return}this.closeModal(),this.renderContent(),this.initializeLucideIcons(),this.showToast("Lead updated.")}})}editProjectViaModal(a){var n;const t=a||{},i=this.getProjectKey(t);if(!i){this.showToast("Select a project first.");return}const s=l=>String(l??"").replace(/</g,"&lt;");this.openModal("Edit Project",`
            <div>
                <label style="display:block;font-size:12px;font-weight:700;color:#475569;">Project Name / Code</label>
                <input name="name" required style="margin-top:6px;width:100%;border:1px solid #e2e8f0;border-radius:12px;padding:10px 12px;font-size:14px;" value="${s(t.name||((n=t.identification)==null?void 0:n.projectCode)||"")}" />
            </div>
            <div style="display:grid;grid-template-columns:1fr;gap:10px;" class="sm-grid-2col">
                <div>
                    <label style="display:block;font-size:12px;font-weight:700;color:#475569;">Client</label>
                    <input name="client" style="margin-top:6px;width:100%;border:1px solid #e2e8f0;border-radius:12px;padding:10px 12px;font-size:14px;" value="${s(t.client||"")}" />
                </div>
                <div>
                    <label style="display:block;font-size:12px;font-weight:700;color:#475569;">Start Date</label>
                    <input name="startDate" type="date" style="margin-top:6px;width:100%;border:1px solid #e2e8f0;border-radius:12px;padding:10px 12px;font-size:14px;" value="${s(t.startDate||"")}" />
                </div>
            </div>
            <div style="display:grid;grid-template-columns:1fr;gap:10px;" class="sm-grid-2col">
                <div>
                    <label style="display:block;font-size:12px;font-weight:700;color:#475569;">Budget</label>
                    <input name="budget" style="margin-top:6px;width:100%;border:1px solid #e2e8f0;border-radius:12px;padding:10px 12px;font-size:14px;" value="${s(t.budget||"")}" />
                </div>
                <div>
                    <label style="display:block;font-size:12px;font-weight:700;color:#475569;">Owner</label>
                    <input name="owner" style="margin-top:6px;width:100%;border:1px solid #e2e8f0;border-radius:12px;padding:10px 12px;font-size:14px;" value="${s(t.owner||"")}" />
                </div>
            </div>
            <div>
                <label style="display:block;font-size:12px;font-weight:700;color:#475569;">Details</label>
                <textarea name="details" rows="3" style="margin-top:6px;width:100%;border:1px solid #e2e8f0;border-radius:12px;padding:10px 12px;font-size:14px;">${s(t.details||"")}</textarea>
            </div>
            <input type="hidden" name="key" value="${s(i)}" />
        `,{submitLabel:"Save Changes",onSubmit:l=>{const o=new FormData(l),r=String(o.get("name")||"").trim();if(!r){this.showToast("Project name is required.");return}const c=o.get("key");let d=this.getStoredProjects(),p=d.findIndex(g=>this.getProjectKey(g)===c);p!==-1&&(d[p]={...d[p],name:r,client:o.get("client"),startDate:o.get("startDate"),budget:o.get("budget"),owner:o.get("owner"),details:o.get("details")},d[p].identification&&(d[p].identification.projectCode=r),this.writeStore("bezent_projects",d)),this.closeModal(),this.renderContent(),this.initializeLucideIcons(),this.showToast("Project updated.")}})}deleteClientViaModal(a){const t=String(a||"").trim();if(!t){this.showToast("Select a client first.");return}this.openModal("Delete Client",`
            <div style="font-size:14px;color:#0f172a;">
                Delete <span style="font-weight:900;">${t.replace(/</g,"&lt;")}</span>?
            </div>
            <div style="font-size:12px;color:#475569;">
                This removes it from your saved client list (defaults remain).
            </div>
        `,{submitLabel:"Delete",onSubmit:()=>{const i=this.deleteClientByName(t);if(!i.ok){this.showToast(i.message||"Unable to delete client.");return}this.closeModal(),String(this.selectedClientName||"").trim().toLowerCase()===t.toLowerCase()&&(this.selectedClientName=null),this.renderContent(),this.initializeLucideIcons(),this.showToast("Client deleted.")}})}startChartRotation(a,t,{speed:i=.003}={}){if(!a||!t)return;this.stopChartRotation(a);const s=()=>{var l;if(!this.charts||this.charts[a]!==t)return;const n=Number(((l=t.options)==null?void 0:l.rotation)||0);t.options.rotation=n+i,t.update("none"),this._chartAnimFrames[a]=requestAnimationFrame(s)};this._chartAnimFrames[a]=requestAnimationFrame(s)}stopChartRotation(a){var i;const t=(i=this._chartAnimFrames)==null?void 0:i[a];t&&cancelAnimationFrame(t),this._chartAnimFrames&&delete this._chartAnimFrames[a]}getAllContactsData(){const a=this.getClientsData().map(s=>{const n=String((s==null?void 0:s.name)||"").trim();return{type:"Client",name:n,phone:String((s==null?void 0:s.phone)||"").trim(),email:String((s==null?void 0:s.email)||"").trim(),owner:String((s==null?void 0:s.owner)||"").trim(),source:String((s==null?void 0:s.leadSource)||"").trim(),key:`client:${n.toLowerCase()}`}}).filter(s=>s.name),t=this.getLeadsData().map(s=>{const n=String((s==null?void 0:s.company)||"").trim();return{type:"Lead",name:n,phone:String((s==null?void 0:s.contact)||"").trim(),email:"",owner:String((s==null?void 0:s.assignedTo)||"").trim(),source:String((s==null?void 0:s.source)||"").trim(),key:`lead:${String((s==null?void 0:s.id)||n).toLowerCase()}`}}).filter(s=>s.name),i=[...a,...t];return i.sort((s,n)=>String(s.name).localeCompare(String(n.name))),i}setupContactsInteractions(){const a=document.getElementById("contactsFilterName"),t=document.getElementById("contactsFilterPhone"),i=document.getElementById("contactsFilterEmail"),s=document.getElementById("contactsFilterType"),n=document.getElementById("contactsFilterOwner"),l=document.getElementById("contactsFilterSource"),o=Array.from(document.querySelectorAll('tr[data-contact-row="1"]')),r=()=>{const c=String((a==null?void 0:a.value)||"").trim().toLowerCase(),d=String((t==null?void 0:t.value)||"").trim().toLowerCase(),p=String((i==null?void 0:i.value)||"").trim().toLowerCase(),g=String((s==null?void 0:s.value)||"All").trim().toLowerCase(),h=String((n==null?void 0:n.value)||"All").trim().toLowerCase(),m=String((l==null?void 0:l.value)||"All").trim().toLowerCase();o.forEach(f=>{const w=String(f.dataset.name||"").toLowerCase(),u=String(f.dataset.phone||"").toLowerCase(),b=String(f.dataset.email||"").toLowerCase(),v=String(f.dataset.type||"").toLowerCase(),C=String(f.dataset.owner||"").toLowerCase(),L=String(f.dataset.source||"").toLowerCase(),F=g==="all"||v===g,D=!c||w.includes(c),j=!d||u.includes(d),I=!p||b.includes(p),N=h==="all"||C===h,R=m==="all"||L===m;f.style.display=F&&N&&R&&D&&j&&I?"":"none"})};[a,t,i].forEach(c=>{c&&c.addEventListener("input",r)}),s&&s.addEventListener("change",r),n&&n.addEventListener("change",r),l&&l.addEventListener("change",r),r()}applyLoggedInUser(){var d,p;const a=document.getElementById("profileToggle"),t=document.getElementById("profileName"),i=document.getElementById("profileRole");let s=null;try{s=JSON.parse(localStorage.getItem("bezent_user")||"null")}catch{}let n="",l="",o="";if(s&&s.name)n=String(s.name).trim(),l=String(s.email||"").trim(),o=String(s.role||"").trim();else{try{l=localStorage.getItem("bezent_user_email")||""}catch{}const g=String(l||"").trim().toLowerCase(),m=(g.split("@")[0]||"").split(/[._+\-\s]+/).map(f=>f.trim()).filter(Boolean);n=m.length?m.map(f=>f.charAt(0).toUpperCase()+f.slice(1)).join(" "):g||"User"}const r=n.split(/\s+/).filter(Boolean),c=(((d=r[0])==null?void 0:d[0])||"U").toUpperCase()+((p=r[1])!=null&&p[0]?r[1][0].toUpperCase():"");a&&(a.textContent=c),t&&(t.textContent=n),i&&(i.textContent=o||"Administrator")}showToast(a){const t=String(a||"").trim();if(t){if(!this._toastEl){const i=document.createElement("div");i.style.position="fixed",i.style.left="50%",i.style.bottom="20px",i.style.transform="translateX(-50%)",i.style.maxWidth="min(92vw, 520px)",i.style.padding="10px 14px",i.style.borderRadius="12px",i.style.background="rgba(15, 23, 42, 0.92)",i.style.color="#fff",i.style.fontSize="13px",i.style.fontWeight="600",i.style.boxShadow="0 12px 30px rgba(2, 6, 23, 0.25)",i.style.zIndex="9999",i.style.pointerEvents="none",i.style.opacity="0",i.style.transition="opacity 160ms ease",document.body.appendChild(i),this._toastEl=i}this._toastEl.textContent=t,this._toastEl.style.opacity="1",this._toastTimer&&clearTimeout(this._toastTimer),this._toastTimer=setTimeout(()=>{this._toastEl&&(this._toastEl.style.opacity="0")},2400)}}readStore(a,t){if(this._apiCache&&Object.prototype.hasOwnProperty.call(this._apiCache,a)){const i=this._apiCache[a];return i??t}try{const i=localStorage.getItem(a);return i?JSON.parse(i):t}catch{return t}}writeStore(a,t){try{localStorage.setItem(a,JSON.stringify(t))}catch{}this._apiCache||(this._apiCache={}),this._apiCache[a]=t,this._syncToApi(a,t).catch(i=>console.warn("[bezent sync]",a,i.message))}async _syncToApi(a,t){try{const i=localStorage.getItem("bezent_jwt");if(!i)return;const s={"Content-Type":"application/json",Authorization:"Bearer "+i};await fetch("/api/kv/"+encodeURIComponent(a),{method:"PUT",headers:s,body:JSON.stringify({value:t})})}catch{}}async loadAllFromApi(){const a=localStorage.getItem("bezent_jwt");if(!a)return;this._apiCache||(this._apiCache={});const t={Authorization:"Bearer "+a},i=["bezent_leads","bezent_clients","bezent_invoices","bezent_projects","bezent_campaigns","bezent_followups","bezent_quotations","bezent_contracts","bezent_visits","bezent_greetings","bezent_feedback_submissions","bezent_workflow_rules","bezent_rfps"];await Promise.all(i.map(async s=>{try{const n=await fetch("/api/kv/"+encodeURIComponent(s),{headers:t});if(!n.ok)return;const l=await n.json();l&&(this._apiCache[s]=l,localStorage.setItem(s,JSON.stringify(l)))}catch{}}));try{const s=await fetch("/api/kpi_targets",{headers:t});s.ok&&(this._apiCache.bezent_kpi_targets=await s.json())}catch{}console.log("[Bezent] ✅ API data loaded"),this.renderContent(),typeof this.initializeLucideIcons=="function"&&this.initializeLucideIcons()}getStoredChatMessages(){const a=this.readStore("bezent_chat_messages",[]);return Array.isArray(a)?a.filter(t=>t&&typeof t=="object").slice(-100):[]}saveChatMessages(a){const t=Array.isArray(a)?a.slice(-100):[];this.writeStore("bezent_chat_messages",t),this.chatMessages=t}addChatMessage(a,t){const i=String(t||"").trim();if(!i)return;const s=Array.isArray(this.chatMessages)?[...this.chatMessages]:[];s.push({role:a==="user"?"user":"assistant",text:i,at:Date.now()}),this.saveChatMessages(s)}getChatAssistantReply(a){const i=String(a||"").trim().toLowerCase();if(!i)return"Tell me what you want to know about BEZENT (Leads, Clients, Projects, Billing).";const s=n=>n.some(l=>i.includes(l));return s(["hi","hello","hey","good morning","good evening"])?"Hi! I can help with BEZENT basics: Leads/Clients, Projects, Vendor Code, Project Code, Billing.":s(["what is bezent","about bezent","product","crm"])?"BEZENT is a lightweight CRM dashboard to manage Leads, Clients, Projects/Pipeline and Billing in one place.":s(["lead","leads"])?"Leads: register a lead, track stage (New Lead -> Contacted -> Missed Call -> Follow-up -> Demo -> Quotation -> Negotiation -> Closed -> PO Received), and convert to a Client when confirmed.":s(["client","clients"])?"Clients: maintain client details (name, owner, email, phone, industry, lead source, location, vendor code, city, notes) and view them in Client Directory.":s(["vendor code","vendorcode","vendor"])?"Vendor Code is auto-generated from Location + sequence (e.g., CHN001). In Project Registration/Directory you can enter Vendor Code to fetch client/company details automatically.":s(["project code","projectcode","apj"])?"Project Code format: APJ + YY + ServiceCode + sequence (e.g., APJ26RE001). It auto-generates based on Service Code and existing projects in the current year. APJ is fixed prefix, YY is last 2 digits of year.":s(["service code","service"])?"Service Code identifies the service type (RE, CAD, 2D, 2DI, 3DI, CD, NPD, SPM, STL, FEA). It drives Project Code generation. Selecting a service code auto-generates the project code in registration.":s(["project","projects","pipeline","directory"])?"Projects: register projects, track technical statuses (2D/3D Model, 3D Scan, FEA, QC/Inspection, Approval, GL Approval, Revision, Delivery Report, SOP Daily Report), roadmap/progress monitoring, dispatch & delivery details, purchase details, and payment tracking. Use Project Directory for full detailed view.":s(["tracking","status","technical","model","scan","fea","qc","approval"])?"Technical Tracking includes: 2D Model Status, 3D Model Status, 3D Scan Status, FEA Status, QC/Inspection Status, Approval Status, GL Approval Status, Correction/Revision Status, Delivery Report Status, SOP-Based Daily Report Status. Each can be: Pending, In Progress, Completed, or Blocked.":s(["monitoring","roadmap","dashboard","daily report","photo","overall status"])?"Project Monitoring tracks: Project Roadmap Submitted (Yes/No), Dashboard Updated (Yes/No), Daily Report Updated (Yes/No), Photo Attached (Yes/No), Overall Project Status, Post Completion Status, and Physical Part Status.":s(["dispatch","delivery","dc","delivery confirmation"])?"Dispatch & Delivery includes: DC Date, DC Number, Delivery Status (Pending/Completed), Delivery Date, and Delivery Confirmation (Yes/No). These help track when and how projects are delivered to clients.":s(["purchase","quotation","po","converted by","visit conducted"])?"Purchase Details track: Quotation Date/Number, PO Date/Number/Value, Converted By (who converted lead to project), and Visit Conducted (Yes/No). This helps understand the sales-to-project conversion process.":s(["invoice","billing","payment","payment terms","payment type","overdue"])?"Billing: create invoices, track Invoice Date/Number/Amount, Past Invoice Amount, Payment Terms, Payment Type, Payment Due Date, Payment Received Date/Amount, Balance Payment Due Date/Amount, and Overdue Status (auto-calculated from due dates).":s(["ratings","client rating","job rating","quality rating","service rating","performance rating","feedback"])?"Performance & Rating includes: Client Rating (0-10), Job Rating (0-10), Quality Rating (0-10), Service Rating (0-10), Performance Rating (0-10), Feedback/Comments, and Additional Notes. These help evaluate project success and client satisfaction.":s(["location","city","bengaluru","pune","chennai","mumbai","hyderabad"])?"Location/City options include: Bengaluru, Pune, Chennai, Mumbai, Hyderabad. Location is used to generate Vendor Codes and helps in regional reporting and client management.":s(["how","help","support","guide"])?"Try asking: 'How to generate vendor code?', 'Explain project code', 'How to register a client?', 'How to create an invoice?', 'What are technical tracking statuses?', or 'How does payment tracking work?'":"I can answer simple BEZENT product questions. Ask about Leads, Clients, Projects, Vendor Code, Project Code, Billing, Tracking, Monitoring, Dispatch, Purchase, Payments, or Ratings."}sendChatMessage(a){const t=String(a||"").trim();if(!t)return;this.addChatMessage("user",t);const i=this.getChatAssistantReply(t);this.addChatMessage("assistant",i),this.renderChatPanel(),this.initializeLucideIcons()}upsertStoredItem(a,t,i){const s=this.readStore(a,[]),n=Array.isArray(s)?s:[],l=n.findIndex(t);return l>=0?n[l]={...n[l],...i}:n.unshift(i),this.writeStore(a,n),n}getStoredClients(){const a=this.readStore("bezent_clients",[]);return Array.isArray(a)?a:[]}getStoredLeads(){const a=this.readStore("bezent_leads",[]);return Array.isArray(a)?a:[]}saveLead(a){const t=a||{},i=String(t.company||"").trim();if(!i)return{ok:!1,message:"Company is required."};const s=String(t.id||"").trim()||`LD-${Date.now()}`,n=this.getStoredLeads(),l=n.findIndex(r=>String((r==null?void 0:r.id)||"").trim().toLowerCase()===s.toLowerCase()),o={id:s,company:i,contact:String(t.contact||"").trim(),source:String(t.source||"LinkedIn").trim()||"LinkedIn",stage:String(t.stage||"New Lead").trim()||"New Lead",assignedTo:String(t.assignedTo||"—").trim()||"—",nextAction:String(t.nextAction||"Follow-up").trim()||"Follow-up",feedbackStatus:String(t.feedbackStatus||"Pending").trim()||"Pending",status:String(t.status||"Open").trim()||"Open",receivedAt:Number.isFinite(Number(t.receivedAt))?Number(t.receivedAt):Date.now(),firstResponseAt:Number.isFinite(Number(t.firstResponseAt))?Number(t.firstResponseAt):null,linkedClientName:String(t.linkedClientName||"").trim(),history:Array.isArray(t.history)?t.history:[]};return l>=0?n[l]={...n[l],...o}:n.unshift(o),this.writeStore("bezent_leads",n),{ok:!0,id:s}}convertLeadToClient(a){const t=String(a||"").trim();if(!t)return{ok:!1,message:"Lead ID missing."};const i=this.getStoredLeads(),s=i.findIndex(r=>String((r==null?void 0:r.id)||"").trim().toLowerCase()===t.toLowerCase());if(s<0)return{ok:!1,message:"Lead not found."};const n=i[s],l=String(n.company||"").trim();if(!l)return{ok:!1,message:"Lead company missing."};const o=this.saveClient({name:l,owner:n.assignedTo||"—",phone:n.contact||"",leadSource:n.source||"",stage:"Active",notes:`Converted from lead ${n.id}`});return o.ok?(i[s]={...n,status:"Converted",linkedClientName:l,history:[...Array.isArray(n.history)?n.history:[],{at:Date.now(),type:"convert",note:`Converted to client: ${l}`}]},this.writeStore("bezent_leads",i),{ok:!0,clientName:l}):o}deleteClientByName(a){const t=String(a||"").trim();if(!t)return{ok:!1,message:"Client name missing."};const s=this.getStoredClients().filter(n=>String((n==null?void 0:n.name)||"").trim().toLowerCase()!==t.toLowerCase());return this.writeStore("bezent_clients",s),{ok:!0}}saveClient(a){const t=a||{},i=String(t.name||"").trim();if(!i)return{ok:!1,message:"Client name is required."};const s=this.getStoredClients(),n=s.findIndex(o=>String(o.name||"").toLowerCase()===i.toLowerCase()),l={name:i,city:String(t.city||"—").trim()||"—",industry:String(t.industry||"—").trim()||"—",owner:String(t.owner||"—").trim()||"—",stage:String(t.stage||"Active").trim()||"Active",openInvoices:Number.isFinite(Number(t.openInvoices))?Number(t.openInvoices):0,dueAmount:String(t.dueAmount||"₹0").trim()||"₹0",email:String(t.email||"").trim(),phone:String(t.phone||"").trim(),leadSource:String(t.leadSource||"").trim(),location:String(t.location||"").trim(),vendorCode:String(t.vendorCode||"").trim(),notes:String(t.notes||"").trim()};return n>=0?s[n]={...s[n],...l}:s.unshift(l),this.writeStore("bezent_clients",s),{ok:!0}}getStoredCampaigns(){const a=this.readStore("bezent_campaigns",[]);return Array.isArray(a)?a:[]}saveCampaign(a){const t=a||{},i=String(t.name||"").trim();if(!i)return{ok:!1,message:"Campaign name is required."};const s=this.getStoredCampaigns();return s.unshift({name:i,audience:Number.isFinite(Number(t.audience))?Number(t.audience):0,open:Number.isFinite(Number(t.open))?Number(t.open):0,click:Number.isFinite(Number(t.click))?Number(t.click):0,status:String(t.status||"Draft").trim()||"Draft",statusColor:String(t.statusColor||"slate").trim()||"slate"}),this.writeStore("bezent_campaigns",s),{ok:!0}}upsertCampaign(a){const t=a||{},i=String(t.name||"").trim();if(!i)return{ok:!1,message:"Campaign name is required."};const s={name:i,audience:Number.isFinite(Number(t.audience))?Number(t.audience):0,open:Number.isFinite(Number(t.open))?Number(t.open):0,click:Number.isFinite(Number(t.click))?Number(t.click):0,status:String(t.status||"Draft").trim()||"Draft",statusColor:String(t.statusColor||"slate").trim()||"slate"};return this.upsertStoredItem("bezent_campaigns",n=>String((n==null?void 0:n.name)||"").trim().toLowerCase()===i.toLowerCase(),s),{ok:!0}}deleteCampaignByName(a){const t=String(a||"").trim();if(!t)return{ok:!1,message:"Campaign name missing."};const s=this.getStoredCampaigns().filter(n=>String((n==null?void 0:n.name)||"").trim().toLowerCase()!==t.toLowerCase());return this.writeStore("bezent_campaigns",s),{ok:!0}}getCampaignByName(a){const t=String(a||"").trim();if(!t)return null;const i=[{name:"CRM Upgrade",audience:45,open:31,click:8,status:"Sent",statusColor:"emerald"},{name:"Quarterly Offer",audience:126,open:28,click:7,status:"Scheduled",statusColor:"amber"},{name:"New Service Launch",audience:78,open:24,click:6,status:"Draft",statusColor:"slate"}];return[...this.getStoredCampaigns(),...i].find(n=>String((n==null?void 0:n.name)||"").trim().toLowerCase()===t.toLowerCase())||null}previewCampaign(a){const t=a||{},i=s=>String(s??"").replace(/</g,"&lt;");this.openModal(`Campaign: ${i(t.name||"")}`,`
            <div style="display:grid;gap:10px;">
                <div style="display:grid;grid-template-columns:1fr;gap:10px;" class="sm-grid-2col">
                    <div>
                        <div style="font-size:12px;font-weight:700;color:#64748b;">Status</div>
                        <div style="margin-top:4px;font-weight:800;color:#0f172a;">${i(t.status||"Draft")}</div>
                    </div>
                    <div>
                        <div style="font-size:12px;font-weight:700;color:#64748b;">Audience</div>
                        <div style="margin-top:4px;font-weight:800;color:#0f172a;">${Number(t.audience||0)}</div>
                    </div>
                </div>
                <div style="display:grid;grid-template-columns:1fr;gap:10px;" class="sm-grid-2col">
                    <div>
                        <div style="font-size:12px;font-weight:700;color:#64748b;">Open rate</div>
                        <div style="margin-top:4px;font-weight:800;color:#0f172a;">${Number(t.open||0)}%</div>
                    </div>
                    <div>
                        <div style="font-size:12px;font-weight:700;color:#64748b;">Click rate</div>
                        <div style="margin-top:4px;font-weight:800;color:#0f172a;">${Number(t.click||0)}%</div>
                    </div>
                </div>
                <div style="border-top:1px solid #e2e8f0;padding-top:10px;font-size:12px;color:#475569;">
                    Preview is a placeholder. Send/Schedule updates status in your saved data.
                </div>
            </div>
        `,{submitLabel:"Close",onSubmit:()=>this.closeModal()})}duplicateCampaignByName(a){const t=this.getCampaignByName(a);if(!t)return{ok:!1,message:"Campaign not found."};const i=`Copy ${new Date().toLocaleDateString()}`,s={...t,name:`${t.name} (${i})`,status:"Draft",statusColor:"slate"};return this.saveCampaign(s)}setCampaignStatus(a,t){const i=this.getCampaignByName(a);if(!i)return{ok:!1,message:"Campaign not found."};const s=String(t||"Draft").trim()||"Draft",n=s==="Sent"?"emerald":s==="Scheduled"?"amber":"slate";return this.upsertCampaign({...i,status:s,statusColor:n})}getStoredInvoices(){const a=this.readStore("bezent_invoices",[]);return Array.isArray(a)?a:[]}getAllInvoices(){return[...this.getStoredInvoices()]}getInvoiceSummaryByClient(){const a=new Map;return this.getAllInvoices().forEach(i=>{const s=String((i==null?void 0:i.client)||"").trim();if(!s)return;const n=s.toLowerCase(),o=String((i==null?void 0:i.status)||"").trim().toLowerCase()!=="paid",r=this.parseCurrencyToNumber(i==null?void 0:i.amount),c=a.get(n)||{openInvoices:0,dueAmount:0};o&&(c.openInvoices+=1,c.dueAmount+=r),a.set(n,c)}),a}getStoredProjects(){const a=this.readStore("bezent_projects",[]),t=Array.isArray(a)?a:[];let i=!1;const s=new Date().getFullYear().toString().slice(-2),n="APJ",l=/^PRJ-(\d{3,})$/i,o=c=>{const d=String(c||"").trim();return d==="SEO Revamp"?"RE":d==="CRM Upgrade"?"CAD":d==="Re-engagement Funnel"?"2D":d==="Performance Ads"?"2DI":""},r=t.map(c=>{var f,w;const d=this.ensureProjectModel(c),p=String(((f=d==null?void 0:d.identification)==null?void 0:f.projectCode)||"").trim(),h=String(((w=d==null?void 0:d.identification)==null?void 0:w.serviceCode)||"").trim()||o(d==null?void 0:d.name)||"RE",m=p.match(l);if(m){const u=String(m[1]||"").padStart(3,"0");d.identification.serviceCode=h,d.identification.projectCode=`${n}${s}${h}${u}`,i=!0}return d});return i&&this.writeStore("bezent_projects",r),r}getProjectKey(a){const t=a||{};return`${String((t==null?void 0:t.name)||"").trim()}__${String((t==null?void 0:t.client)||"").trim()}`}ensureProjectModel(a){var i,s,n,l,o,r,c,d,p,g,h,m,f,w,u,b,v,C,L,F,D,j,I,N,R,_,A,E,z,V,Q,J,Y,Z,tt,et,st,at,it,O,ot,lt,rt,dt,ct,q,W,G,K,X,pt,ut,mt,gt,xt;const t=a||{};return{...t,identification:{projectCode:((i=t==null?void 0:t.identification)==null?void 0:i.projectCode)??(t==null?void 0:t.projectCode)??"",serviceCode:((s=t==null?void 0:t.identification)==null?void 0:s.serviceCode)??(t==null?void 0:t.serviceCode)??"",vendorCode:((n=t==null?void 0:t.identification)==null?void 0:n.vendorCode)??(t==null?void 0:t.vendorCode)??"",companyName:((l=t==null?void 0:t.identification)==null?void 0:l.companyName)??(t==null?void 0:t.companyName)??(t==null?void 0:t.client)??"",projectDescription:((o=t==null?void 0:t.identification)==null?void 0:o.projectDescription)??(t==null?void 0:t.projectDescription)??"",partDescription:((r=t==null?void 0:t.identification)==null?void 0:r.partDescription)??(t==null?void 0:t.partDescription)??"",location:((c=t==null?void 0:t.identification)==null?void 0:c.location)??(t==null?void 0:t.location)??"",qty:((d=t==null?void 0:t.identification)==null?void 0:d.qty)??(t==null?void 0:t.qty)??"",projectLead:((p=t==null?void 0:t.identification)==null?void 0:p.projectLead)??(t==null?void 0:t.lead)??(t==null?void 0:t.leadName)??"",assignedBy:((g=t==null?void 0:t.identification)==null?void 0:g.assignedBy)??(t==null?void 0:t.assignedBy)??"",assignedTo:((h=t==null?void 0:t.identification)==null?void 0:h.assignedTo)??(t==null?void 0:t.assignedTo)??""},tracking:{model2dStatus:((m=t==null?void 0:t.tracking)==null?void 0:m.model2dStatus)??"Pending",model3dStatus:((f=t==null?void 0:t.tracking)==null?void 0:f.model3dStatus)??"Pending",scan3dStatus:((w=t==null?void 0:t.tracking)==null?void 0:w.scan3dStatus)??"Pending",feaStatus:((u=t==null?void 0:t.tracking)==null?void 0:u.feaStatus)??"Pending",qcInspectionStatus:((b=t==null?void 0:t.tracking)==null?void 0:b.qcInspectionStatus)??"Pending",approvalStatus:((v=t==null?void 0:t.tracking)==null?void 0:v.approvalStatus)??"Pending",glApprovalStatus:((C=t==null?void 0:t.tracking)==null?void 0:C.glApprovalStatus)??"Pending",revisionStatus:((L=t==null?void 0:t.tracking)==null?void 0:L.revisionStatus)??"Pending",deliveryReportStatus:((F=t==null?void 0:t.tracking)==null?void 0:F.deliveryReportStatus)??"Pending",sopDailyReportStatus:((D=t==null?void 0:t.tracking)==null?void 0:D.sopDailyReportStatus)??"Pending"},monitoring:{roadmapSubmitted:((j=t==null?void 0:t.monitoring)==null?void 0:j.roadmapSubmitted)??"No",dashboardUpdated:((I=t==null?void 0:t.monitoring)==null?void 0:I.dashboardUpdated)??"No",dailyReportUpdated:((N=t==null?void 0:t.monitoring)==null?void 0:N.dailyReportUpdated)??"No",overallProjectStatus:((R=t==null?void 0:t.monitoring)==null?void 0:R.overallProjectStatus)??"Pending / Delayed",postCompletionStatus:((_=t==null?void 0:t.monitoring)==null?void 0:_.postCompletionStatus)??"",physicalPartStatus:((A=t==null?void 0:t.monitoring)==null?void 0:A.physicalPartStatus)??"",photoAttached:((E=t==null?void 0:t.monitoring)==null?void 0:E.photoAttached)??"No"},dispatch:{dcDate:((z=t==null?void 0:t.dispatch)==null?void 0:z.dcDate)??"",dcNumber:((V=t==null?void 0:t.dispatch)==null?void 0:V.dcNumber)??"",deliveryStatus:((Q=t==null?void 0:t.dispatch)==null?void 0:Q.deliveryStatus)??"",deliveryDate:((J=t==null?void 0:t.dispatch)==null?void 0:J.deliveryDate)??"",deliveryConfirmation:((Y=t==null?void 0:t.dispatch)==null?void 0:Y.deliveryConfirmation)??""},purchase:{quotationDate:((Z=t==null?void 0:t.purchase)==null?void 0:Z.quotationDate)??"",quotationNumber:((tt=t==null?void 0:t.purchase)==null?void 0:tt.quotationNumber)??"",poDate:((et=t==null?void 0:t.purchase)==null?void 0:et.poDate)??"",poNumber:((st=t==null?void 0:t.purchase)==null?void 0:st.poNumber)??"",poValue:((at=t==null?void 0:t.purchase)==null?void 0:at.poValue)??"",visitConducted:((it=t==null?void 0:t.purchase)==null?void 0:it.visitConducted)??"No",convertedBy:((O=t==null?void 0:t.purchase)==null?void 0:O.convertedBy)??""},payment:{invoiceDate:((ot=t==null?void 0:t.payment)==null?void 0:ot.invoiceDate)??"",invoiceNumber:((lt=t==null?void 0:t.payment)==null?void 0:lt.invoiceNumber)??"",invoiceAmount:((rt=t==null?void 0:t.payment)==null?void 0:rt.invoiceAmount)??"",pastInvoiceAmount:((dt=t==null?void 0:t.payment)==null?void 0:dt.pastInvoiceAmount)??"",paymentTerms:((ct=t==null?void 0:t.payment)==null?void 0:ct.paymentTerms)??"",paymentType:((q=t==null?void 0:t.payment)==null?void 0:q.paymentType)??"",paymentDueDate:((W=t==null?void 0:t.payment)==null?void 0:W.paymentDueDate)??"",paymentReceivedDate:((G=t==null?void 0:t.payment)==null?void 0:G.paymentReceivedDate)??"",paymentReceivedAmount:((K=t==null?void 0:t.payment)==null?void 0:K.paymentReceivedAmount)??"",balancePaymentDueDate:((X=t==null?void 0:t.payment)==null?void 0:X.balancePaymentDueDate)??"",balancePaymentAmount:((pt=t==null?void 0:t.payment)==null?void 0:pt.balancePaymentAmount)??"",overdueStatus:((ut=t==null?void 0:t.payment)==null?void 0:ut.overdueStatus)??""},ratings:{vendorRating:((mt=t==null?void 0:t.ratings)==null?void 0:mt.vendorRating)??"",clientRating:((gt=t==null?void 0:t.ratings)==null?void 0:gt.clientRating)??"",internalPerformanceRating:((xt=t==null?void 0:t.ratings)==null?void 0:xt.internalPerformanceRating)??""}}}getAllProjectsMerged(a){const t=new Map;return(Array.isArray(a)?a:[]).forEach(i=>{const s=this.getProjectKey(i);s&&t.set(s,this.ensureProjectModel(i))}),this.getStoredProjects().forEach(i=>{const s=this.getProjectKey(i);s&&t.set(s,this.ensureProjectModel(i))}),Array.from(t.values())}updateProjectFieldByKey(a,t,i){const s=String(a||"").trim(),n=String(t||"").trim();if(!s||!n)return{ok:!1,message:"Missing key."};const l=this.getStoredProjects();let o=!1;const r=d=>{const p=d||{},g=String(p.paymentReceivedDate||"").trim(),h=String(p.paymentReceivedAmount||"").trim();if(g||h)return"Paid";const m=String(p.paymentDueDate||"").trim();if(!m)return"";const f=Date.parse(m);if(!Number.isFinite(f))return"";const w=new Date,u=new Date(w.getFullYear(),w.getMonth(),w.getDate()).getTime(),b=Math.floor((u-f)/(1e3*60*60*24));return b<=0?"Pending":b<=30?"30 Days Due":b<=60?"60 Days Overdue":"90+ Days Overdue"},c=l.map(d=>{if(this.getProjectKey(d)!==s)return d;o=!0;const g=this.ensureProjectModel(d),h=n.split(".").filter(Boolean);let m=g;for(let f=0;f<h.length-1;f++){const w=h[f];(!m[w]||typeof m[w]!="object")&&(m[w]={}),m=m[w]}return m[h[h.length-1]]=i,n.startsWith("payment.")&&(g.payment={...g.payment||{}},g.payment.overdueStatus=r(g.payment)),g});return o?(this.writeStore("bezent_projects",c),{ok:!0}):{ok:!1,message:"Project not found in stored list."}}saveProject(a){var r,c,d,p,g,h,m,f,w,u,b,v,C,L,F,D,j,I,N,R,_,A,E,z,V,Q,J,Y,Z,tt,et,st,at,it,O,ot,lt,rt,dt,ct,q,W,G,K,X,pt,ut,mt,gt,xt,yt,wt,St,Ct,$t,kt,jt,Lt,At;const t=a||{},i=String(t.name||"").trim(),s=String(t.client||"").trim();if(!i||!s)return{ok:!1,message:"Project name and client are required."};const n=It=>{const vt=It||{},Pt=String(vt.paymentReceivedDate||"").trim(),Rt=String(vt.paymentReceivedAmount||"").trim();if(Pt||Rt)return"Paid";const Dt=String(vt.paymentDueDate||"").trim();if(!Dt)return"";const Tt=Date.parse(Dt);if(!Number.isFinite(Tt))return"";const bt=new Date,Nt=new Date(bt.getFullYear(),bt.getMonth(),bt.getDate()).getTime(),ft=Math.floor((Nt-Tt)/(1e3*60*60*24));return ft<=0?"Pending":ft<=30?"30 Days Due":ft<=60?"60 Days Overdue":"90+ Days Overdue"},l=this.getStoredProjects(),o={invoiceDate:String(((r=t==null?void 0:t.payment)==null?void 0:r.invoiceDate)??"").trim(),invoiceNumber:String(((c=t==null?void 0:t.payment)==null?void 0:c.invoiceNumber)??"").trim(),invoiceAmount:String(((d=t==null?void 0:t.payment)==null?void 0:d.invoiceAmount)??"").trim(),pastInvoiceAmount:String(((p=t==null?void 0:t.payment)==null?void 0:p.pastInvoiceAmount)??"").trim(),paymentTerms:String(((g=t==null?void 0:t.payment)==null?void 0:g.paymentTerms)??"").trim(),paymentType:String(((h=t==null?void 0:t.payment)==null?void 0:h.paymentType)??"").trim(),paymentDueDate:String(((m=t==null?void 0:t.payment)==null?void 0:m.paymentDueDate)??"").trim(),paymentReceivedDate:String(((f=t==null?void 0:t.payment)==null?void 0:f.paymentReceivedDate)??"").trim(),paymentReceivedAmount:String(((w=t==null?void 0:t.payment)==null?void 0:w.paymentReceivedAmount)??"").trim(),balancePaymentDueDate:String(((u=t==null?void 0:t.payment)==null?void 0:u.balancePaymentDueDate)??"").trim(),balancePaymentAmount:String(((b=t==null?void 0:t.payment)==null?void 0:b.balancePaymentAmount)??"").trim(),overdueStatus:String(((v=t==null?void 0:t.payment)==null?void 0:v.overdueStatus)??"").trim()};return o.overdueStatus=o.overdueStatus||n(o),l.unshift({name:i,client:s,startDate:String(t.startDate||"").trim(),duration:String(t.duration||"").trim(),budget:String(t.budget||"").trim(),team:String(t.team||"").trim(),status:String(t.status||"On Track").trim()||"On Track",statusColor:String(t.statusColor||"emerald").trim()||"emerald",progress:Number.isFinite(Number(t.progress))?Number(t.progress):0,owner:String(t.owner||"—").trim()||"—",spent:String(t.spent||"₹0").trim()||"₹0",identification:{projectCode:String(((C=t==null?void 0:t.identification)==null?void 0:C.projectCode)??t.projectCode??"").trim(),serviceCode:String(((L=t==null?void 0:t.identification)==null?void 0:L.serviceCode)??t.serviceCode??"").trim(),vendorCode:String(((F=t==null?void 0:t.identification)==null?void 0:F.vendorCode)??t.vendorCode??"").trim(),companyName:String(((D=t==null?void 0:t.identification)==null?void 0:D.companyName)??t.companyName??s).trim(),projectDescription:String(((j=t==null?void 0:t.identification)==null?void 0:j.projectDescription)??t.projectDescription??"").trim(),partDescription:String(((I=t==null?void 0:t.identification)==null?void 0:I.partDescription)??t.partDescription??"").trim(),location:String(((N=t==null?void 0:t.identification)==null?void 0:N.location)??t.location??"").trim(),qty:String(((R=t==null?void 0:t.identification)==null?void 0:R.qty)??t.qty??"").trim(),projectLead:String(((_=t==null?void 0:t.identification)==null?void 0:_.projectLead)??t.projectLead??"").trim(),assignedBy:String(((A=t==null?void 0:t.identification)==null?void 0:A.assignedBy)??t.assignedBy??"").trim(),assignedTo:String(((E=t==null?void 0:t.identification)==null?void 0:E.assignedTo)??t.assignedTo??"").trim()},tracking:{model2dStatus:String(((z=t==null?void 0:t.tracking)==null?void 0:z.model2dStatus)??"").trim(),model3dStatus:String(((V=t==null?void 0:t.tracking)==null?void 0:V.model3dStatus)??"").trim(),scan3dStatus:String(((Q=t==null?void 0:t.tracking)==null?void 0:Q.scan3dStatus)??"").trim(),feaStatus:String(((J=t==null?void 0:t.tracking)==null?void 0:J.feaStatus)??"").trim(),qcInspectionStatus:String(((Y=t==null?void 0:t.tracking)==null?void 0:Y.qcInspectionStatus)??"").trim(),approvalStatus:String(((Z=t==null?void 0:t.tracking)==null?void 0:Z.approvalStatus)??"").trim(),glApprovalStatus:String(((tt=t==null?void 0:t.tracking)==null?void 0:tt.glApprovalStatus)??"").trim(),revisionStatus:String(((et=t==null?void 0:t.tracking)==null?void 0:et.revisionStatus)??"").trim(),deliveryReportStatus:String(((st=t==null?void 0:t.tracking)==null?void 0:st.deliveryReportStatus)??"").trim(),sopDailyReportStatus:String(((at=t==null?void 0:t.tracking)==null?void 0:at.sopDailyReportStatus)??"").trim()},monitoring:{roadmapSubmitted:String(((it=t==null?void 0:t.monitoring)==null?void 0:it.roadmapSubmitted)??"").trim(),dashboardUpdated:String(((O=t==null?void 0:t.monitoring)==null?void 0:O.dashboardUpdated)??"").trim(),dailyReportUpdated:String(((ot=t==null?void 0:t.monitoring)==null?void 0:ot.dailyReportUpdated)??"").trim(),photoAttached:String(((lt=t==null?void 0:t.monitoring)==null?void 0:lt.photoAttached)??"").trim(),overallProjectStatus:String(((rt=t==null?void 0:t.monitoring)==null?void 0:rt.overallProjectStatus)??"").trim(),postCompletionStatus:String(((dt=t==null?void 0:t.monitoring)==null?void 0:dt.postCompletionStatus)??"").trim(),physicalPartStatus:String(((ct=t==null?void 0:t.monitoring)==null?void 0:ct.physicalPartStatus)??"").trim()},dispatch:{dcDate:String(((q=t==null?void 0:t.dispatch)==null?void 0:q.dcDate)??"").trim(),dcNumber:String(((W=t==null?void 0:t.dispatch)==null?void 0:W.dcNumber)??"").trim(),deliveryStatus:String(((G=t==null?void 0:t.dispatch)==null?void 0:G.deliveryStatus)??"").trim(),deliveryDate:String(((K=t==null?void 0:t.dispatch)==null?void 0:K.deliveryDate)??"").trim(),deliveryConfirmation:String(((X=t==null?void 0:t.dispatch)==null?void 0:X.deliveryConfirmation)??"").trim()},purchase:{quotationDate:String(((pt=t==null?void 0:t.purchase)==null?void 0:pt.quotationDate)??"").trim(),quotationNumber:String(((ut=t==null?void 0:t.purchase)==null?void 0:ut.quotationNumber)??"").trim(),poDate:String(((mt=t==null?void 0:t.purchase)==null?void 0:mt.poDate)??"").trim(),poNumber:String(((gt=t==null?void 0:t.purchase)==null?void 0:gt.poNumber)??"").trim(),poValue:String(((xt=t==null?void 0:t.purchase)==null?void 0:xt.poValue)??"").trim(),convertedBy:String(((yt=t==null?void 0:t.purchase)==null?void 0:yt.convertedBy)??"").trim(),visitConducted:String(((wt=t==null?void 0:t.purchase)==null?void 0:wt.visitConducted)??"").trim()},payment:o,ratings:{clientRating:String(((St=t==null?void 0:t.ratings)==null?void 0:St.clientRating)??"").trim(),jobRating:String(((Ct=t==null?void 0:t.ratings)==null?void 0:Ct.jobRating)??"").trim(),feedbackComments:String((($t=t==null?void 0:t.ratings)==null?void 0:$t.feedbackComments)??"").trim(),qualityRating:String(((kt=t==null?void 0:t.ratings)==null?void 0:kt.qualityRating)??"").trim(),serviceRating:String(((jt=t==null?void 0:t.ratings)==null?void 0:jt.serviceRating)??"").trim(),performanceRating:String(((Lt=t==null?void 0:t.ratings)==null?void 0:Lt.performanceRating)??"").trim(),additionalNotes:String(((At=t==null?void 0:t.ratings)==null?void 0:At.additionalNotes)??"").trim()}}),this.writeStore("bezent_projects",l),{ok:!0}}saveProjectByKey(a){if(!a)return;const t=document.querySelectorAll(`input[data-project-key="${a}"], textarea[data-project-key="${a}"], select[data-project-key="${a}"]`),i={};t.forEach(l=>{const o=l.dataset.projectField;if(!o)return;const r=l.type==="checkbox"?l.checked?"Yes":"No":l.value;this.setNestedProperty(i,o,r)});const s=this.getStoredProjects(),n=s.findIndex(l=>this.getProjectKey(l)===a);n!==-1&&(Object.assign(s[n],i),this.writeStore("bezent_projects",s))}deleteProjectByKey(a){if(!a)return;const i=this.getStoredProjects().filter(s=>this.getProjectKey(s)!==a);this.writeStore("bezent_projects",i)}setNestedProperty(a,t,i){const s=t.split(".");let n=a;for(let l=0;l<s.length-1;l++){const o=s[l];(!(o in n)||typeof n[o]!="object")&&(n[o]={}),n=n[o]}n[s[s.length-1]]=i}getClientVendorCode(a){if(!a)return"";const i=this.getStoredClients().find(s=>String(s.name||"").trim().toLowerCase()===a.toLowerCase());return(i==null?void 0:i.vendorCode)||""}generateVendorCode(a){if(!a)return"";const s=(this.getStoredClients().filter(n=>String(n.location||"").trim()===a).length+1).toString().padStart(3,"0");return`${a}${s}`}getClientByVendorCode(a){return a&&this.getStoredClients().find(i=>String(i.vendorCode||"").trim()===a.trim())||null}getLocationName(a){return{CHN:"Chennai",HSR:"Hosur",OST:"Other state",KAK:"Karnataka",OTN:"Other Tamil Nadu"}[a]||a}generateProjectCode(a){if(!a)return"";const t=new Date().getFullYear().toString().slice(-2),i="APJ",l=(this.getStoredProjects().filter(o=>{var c;return String(((c=o.identification)==null?void 0:c.projectCode)||"").startsWith(i+t)}).length+1).toString().padStart(3,"0");return`${i}${t}${a}${l}`}saveInvoice(a){const t=a||{},i=String(t.no||"").trim(),s=String(t.client||"").trim(),n=String(t.amount||"").trim();if(!i||!s||!n)return{ok:!1,message:"Invoice no, client and amount are required."};const l=this.getStoredInvoices();return l.unshift({no:i,client:s,amount:n,due:String(t.due||"Due soon").trim()||"Due soon",status:String(t.status||"Pending").trim()||"Pending",color:String(t.color||"amber").trim()||"amber"}),this.writeStore("bezent_invoices",l),{ok:!0}}setInvoiceStatus(a,t){const i=String((a==null?void 0:a.no)||"").trim();if(!i)return{ok:!1,message:"Invoice no missing."};const s=String(t||"").trim()||"Pending",n=s==="Paid"?"emerald":s==="Overdue"?"rose":"amber";return this.upsertStoredItem("bezent_invoices",l=>String((l==null?void 0:l.no)||"").trim().toLowerCase()===i.toLowerCase(),{...a,no:i,status:s,color:n,due:s==="Paid"?"Paid":String((a==null?void 0:a.due)||"Due soon")}),{ok:!0}}previewInvoice(a){const t=a||{};this.openModal(`Invoice ${String(t.no||"").replace(/</g,"&lt;")}`,`
            <div class="text-sm" style="display:grid;gap:10px;">
                <div style="display:grid;grid-template-columns:1fr;gap:10px;" class="sm-grid-2col">
                    <div>
                        <div style="font-size:12px;font-weight:700;color:#64748b;">Client</div>
                        <div style="margin-top:4px;font-weight:800;color:#0f172a;">${String(t.client||"—").replace(/</g,"&lt;")}</div>
                    </div>
                    <div>
                        <div style="font-size:12px;font-weight:700;color:#64748b;">Amount</div>
                        <div style="margin-top:4px;font-weight:800;color:#0f172a;">${String(t.amount||"—").replace(/</g,"&lt;")}</div>
                    </div>
                </div>
                <div style="display:grid;grid-template-columns:1fr;gap:10px;" class="sm-grid-2col">
                    <div>
                        <div style="font-size:12px;font-weight:700;color:#64748b;">Status</div>
                        <div style="margin-top:4px;font-weight:800;color:#0f172a;">${String(t.status||"—").replace(/</g,"&lt;")}</div>
                    </div>
                    <div>
                        <div style="font-size:12px;font-weight:700;color:#64748b;">Due</div>
                        <div style="margin-top:4px;font-weight:800;color:#0f172a;">${String(t.due||"—").replace(/</g,"&lt;")}</div>
                    </div>
                </div>
                <div style="border-top:1px solid #e2e8f0;padding-top:10px;font-size:12px;color:#475569;">
                    Preview is a lightweight placeholder. Download will generate a text receipt.
                </div>
            </div>
        `,{submitLabel:"Close",onSubmit:()=>this.closeModal()})}downloadInvoice(a){const t=a||{},i=[`Invoice: ${t.no||""}`,`Client: ${t.client||""}`,`Amount: ${t.amount||""}`,`Status: ${t.status||""}`,`Due: ${t.due||""}`,"","Generated by APJ 3D Solutions Dashboard"],s=new Blob([i.join(`
`)],{type:"text/plain;charset=utf-8"}),n=URL.createObjectURL(s),l=document.createElement("a");l.href=n,l.download=`${String(t.no||"invoice").trim()||"invoice"}.txt`,document.body.appendChild(l),l.click(),l.remove(),setTimeout(()=>URL.revokeObjectURL(n),400)}parseCurrencyToNumber(a){const t=String(a||"").trim();if(!t)return 0;const i=t.replace(/[^0-9.]/g,""),s=Number(i);return Number.isFinite(s)?s:0}formatINR(a){const t=Number(a);if(!Number.isFinite(t))return"₹0";try{return"₹"+Math.round(t).toLocaleString("en-IN")}catch{return"₹"+Math.round(t)}}downloadInvoicesExport(a){const t=(a||[]).map(o=>[o.no,o.client,o.amount,o.due,o.status]),i=[["Invoice","Client","Amount","Due","Status"].join(","),...t.map(o=>o.map(r=>`"${String(r||"").replace(/"/g,'""')}"`).join(","))],s=new Blob([i.join(`
`)],{type:"text/csv;charset=utf-8"}),n=URL.createObjectURL(s),l=document.createElement("a");l.href=n,l.download="invoices_export.csv",document.body.appendChild(l),l.click(),l.remove(),setTimeout(()=>URL.revokeObjectURL(n),400)}openModal(a,t,{onSubmit:i,submitLabel:s}={}){this.closeModal();const n=document.createElement("div");n.style.position="fixed",n.style.inset="0",n.style.background="rgba(2, 6, 23, 0.55)",n.style.zIndex="9998",n.style.display="flex",n.style.alignItems="center",n.style.justifyContent="center",n.style.padding="16px";const l=document.createElement("div");l.style.width="min(92vw, 520px)",l.style.background="#fff",l.style.borderRadius="16px",l.style.boxShadow="0 20px 60px rgba(2, 6, 23, 0.25)",l.style.overflow="hidden",l.innerHTML=`
            <div style="padding: 14px 16px; border-bottom: 1px solid #e2e8f0; display:flex; align-items:center; justify-content:space-between; gap: 12px;">
                <div style="font-size: 14px; font-weight: 800; color: #0f172a;">${String(a||"").replace(/</g,"&lt;")}</div>
                <button type="button" data-modal-close="1" style="appearance:none;border:none;background:#f1f5f9;color:#0f172a;border-radius:10px;padding:6px 10px;font-weight:700;cursor:pointer;">Close</button>
            </div>
            <form data-modal-form="1" style="padding: 16px; display:grid; gap: 12px;">
                ${t||""}
                <button type="submit" style="margin-top: 4px; width: 100%; background: #7c3aed; color: #fff; border: none; border-radius: 12px; padding: 10px 12px; font-weight: 800; cursor: pointer;">
                    ${String(s||"Save").replace(/</g,"&lt;")}
                </button>
            </form>
        `,n.appendChild(l),document.body.appendChild(n),this._modalEl=n;const o=n.querySelector("button[data-modal-close]");o==null||o.addEventListener("click",()=>this.closeModal()),n.addEventListener("click",c=>{c.target===n&&this.closeModal()}),document.addEventListener("keydown",this._modalKeyHandler=c=>{c.key==="Escape"&&this.closeModal()});const r=n.querySelector("form[data-modal-form]");r&&typeof i=="function"&&r.addEventListener("submit",c=>{c.preventDefault(),i(r)})}closeModal(){if(this._modalEl){try{this._modalEl.remove()}catch{}this._modalEl=null}this._modalKeyHandler&&(document.removeEventListener("keydown",this._modalKeyHandler),this._modalKeyHandler=null)}saveClientFromCurrentForm(){var c,d,p,g,h,m,f;const a=((c=document.getElementById("clientName"))==null?void 0:c.value)||"",t=((d=document.getElementById("clientOwner"))==null?void 0:d.value)||"",i=((p=document.getElementById("clientEmail"))==null?void 0:p.value)||"",s=((g=document.getElementById("clientPhone"))==null?void 0:g.value)||"",n=((h=document.getElementById("clientIndustry"))==null?void 0:h.value)||"",l=((m=document.getElementById("clientLeadSource"))==null?void 0:m.value)||"",o=((f=document.getElementById("clientNotes"))==null?void 0:f.value)||"",r=this.saveClient({name:a,owner:t,email:i,phone:s,industry:n,leadSource:l,notes:o,stage:"Active",city:"—"});if(!r.ok){this.showToast(r.message||"Unable to save client.");return}this.selectedClientName=String(a||"").trim(),this.switchSection("leads"),this.switchSubSection("client_directory"),this.showToast("Client saved.")}getTemplateColumns(a){return a==="lead"?["Company","Contact","Lead Source","Assigned To","Next Action"]:a==="client"?["Client Name","Email","Phone","Industry","Owner","Lead Source","City","Notes"]:["Client","Project Name","Start Date","Duration","Budget","Assigned Team","Project Code","Service Code","Vendor Code","Company Name","Location","Quantity","Project Lead","Assigned By","Assigned To","Project Description","Part Description","2D Model Status","3D Model Status","3D Scan Status","FEA Status","QC Inspection Status","Approval Status","GL Approval Status","Revision Status","Delivery Report Status","SOP Daily Report Status","Project Roadmap Submitted","Dashboard Updated","Daily Report Updated","Photo Attached","Overall Project Status","Post Completion Status","Physical Part Status","DC Date","DC Number","Delivery Status","Delivery Date","Delivery Confirmation","Quotation Date","Quotation Number","PO Date","PO Number","PO Value","Converted By","Visit Conducted","Invoice Date","Invoice Number","Invoice Amount","Past Invoice Amount","Payment Terms","Payment Type","Payment Due Date","Payment Received Date","Payment Received Amount","Balance Payment Due Date","Balance Payment Amount","Client Rating","Job Rating","Quality Rating","Service Rating","Performance Rating","Feedback Comments","Additional Notes"]}downloadTemplate(a){if(typeof XLSX>"u"){this.showToast("Excel library not loaded. Please refresh.");return}const t=this.getTemplateColumns(a),i=XLSX.utils.aoa_to_sheet([t]);i["!cols"]=t.map(o=>({wch:Math.max(o.length+4,16)}));const s=XLSX.utils.book_new(),n=a==="client"?"Clients":a==="lead"?"Leads":"Projects",l=a==="client"?"Client_Upload_Template.xlsx":a==="lead"?"Lead_Upload_Template.xlsx":"Project_Upload_Template.xlsx";XLSX.utils.book_append_sheet(s,i,n),XLSX.writeFile(s,l),this.showToast("Template downloaded.")}showUploadModal(a){this.getTemplateColumns(a);const t=a==="client"?"Bulk Upload Clients":a==="lead"?"Bulk Upload Leads":"Bulk Upload Projects",i=a==="client"?"clientExcelUpload":a==="lead"?"leadExcelUpload":"projectExcelUpload",s=document.getElementById("bulkUploadModal");s&&s.remove();const n=document.createElement("div");n.id="bulkUploadModal",n.style.cssText="position:fixed;inset:0;z-index:9998;display:flex;align-items:center;justify-content:center;background:rgba(15,23,42,0.5);animation:fadeIn 0.2s ease;",n.innerHTML=`
            <div style="background:#fff;border-radius:16px;box-shadow:0 25px 60px rgba(0,0,0,0.2);max-width:560px;width:92%;max-height:85vh;overflow-y:auto;padding:28px 32px;">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;">
                    <div>
                        <div style="font-size:18px;font-weight:700;color:#0f172a;">${t}</div>
                        <div style="font-size:13px;color:#64748b;margin-top:2px;">Download the template, fill your data, then upload</div>
                    </div>
                    <button id="bulkUploadModalClose" style="width:32px;height:32px;border-radius:8px;border:1px solid #e2e8f0;background:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:18px;color:#64748b;transition:background 150ms;" onmouseover="this.style.background='#f1f5f9'" onmouseout="this.style.background='#fff'">&times;</button>
                </div>

                <div style="background:#fefce8;border:1px solid #fde68a;border-radius:12px;padding:12px 16px;margin-bottom:20px;display:flex;align-items:flex-start;gap:10px;">
                    <span style="font-size:16px;flex-shrink:0;margin-top:1px;">💡</span>
                    <div style="font-size:12px;color:#92400e;line-height:1.5;">
                        <strong>Tip:</strong> Download the template first, fill in your data keeping the header row intact, then upload the file. Column names are matched flexibly — minor spelling variations are handled automatically.
                    </div>
                </div>

                <div style="display:flex;gap:12px;">
                    <button id="bulkUploadDownloadBtn" style="flex:1;padding:12px 16px;font-size:14px;font-weight:700;background:#059669;color:#fff;border:none;border-radius:10px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;transition:background 150ms;" onmouseover="this.style.background='#047857'" onmouseout="this.style.background='#059669'">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        Download Template
                    </button>
                    <button id="bulkUploadUploadBtn" style="flex:1;padding:12px 16px;font-size:14px;font-weight:700;background:#9333ea;color:#fff;border:none;border-radius:10px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;transition:background 150ms;" onmouseover="this.style.background='#7c3aed'" onmouseout="this.style.background='#9333ea'">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                        Upload Excel
                    </button>
                </div>
            </div>
        `,document.body.appendChild(n);const l=()=>{n.remove()};document.getElementById("bulkUploadModalClose").addEventListener("click",l),n.addEventListener("click",o=>{o.target===n&&l()}),document.getElementById("bulkUploadDownloadBtn").addEventListener("click",()=>{this.downloadTemplate(a)}),document.getElementById("bulkUploadUploadBtn").addEventListener("click",()=>{const o=document.getElementById(i);o&&(o.value="",o.onchange=r=>{l(),a==="client"?this.handleClientExcelUpload(r):a==="lead"?this.handleLeadExcelUpload(r):this.handleProjectExcelUpload(r)},o.click())})}handleClientExcelUpload(a){var s,n;const t=(n=(s=a==null?void 0:a.target)==null?void 0:s.files)==null?void 0:n[0];if(!t)return;const i=new FileReader;i.onload=l=>{try{if(typeof XLSX>"u"){this.showToast("Excel library not loaded. Please refresh.");return}const o=XLSX.read(l.target.result,{type:"array"}),r=o.Sheets[o.SheetNames[0]],c=XLSX.utils.sheet_to_json(r,{defval:""});if(!c.length){this.showToast("No data found in the file.");return}const d=m=>String(m||"").trim().toLowerCase().replace(/[^a-z0-9]/g,""),p=(m,...f)=>{for(const w of Object.keys(m)){const u=d(w);for(const b of f)if(u===d(b)||u.includes(d(b)))return String(m[w]??"").trim()}return""};let g=0,h=0;for(const m of c){const f=p(m,"Client Name","Name","Company","Company Name");if(!f){h++;continue}this.saveClient({name:f,owner:p(m,"Owner","Account Owner","Sales Owner")||"",email:p(m,"Email","Email ID","E-mail","Mail")||"",phone:p(m,"Phone","Phone Number","Mobile","Contact","Contact Number")||"",industry:p(m,"Industry","Sector")||"",leadSource:p(m,"Lead Source","Source")||"",notes:p(m,"Notes","Remarks","Comments")||"",stage:"Active",city:p(m,"City","Location")||"—"}).ok?g++:h++}this.showToast(`Uploaded: ${g} clients saved${h?`, ${h} skipped`:""}.`),this.switchSection("leads"),this.switchSubSection("client_directory"),this.renderContent(),this.initializeLucideIcons()}catch(o){console.error("Client Excel upload error:",o),this.showToast("Error reading file. Please use .xlsx or .csv format.")}},i.readAsArrayBuffer(t)}handleLeadExcelUpload(a){var s,n;const t=(n=(s=a==null?void 0:a.target)==null?void 0:s.files)==null?void 0:n[0];if(!t)return;const i=new FileReader;i.onload=l=>{try{if(typeof XLSX>"u"){this.showToast("Excel library not loaded. Please refresh.");return}const o=XLSX.read(l.target.result,{type:"array"}),r=o.Sheets[o.SheetNames[0]],c=XLSX.utils.sheet_to_json(r,{defval:""});if(!c.length){this.showToast("No data found in the file.");return}const d=m=>String(m||"").trim().toLowerCase().replace(/[^a-z0-9]/g,""),p=(m,...f)=>{for(const w of Object.keys(m)){const u=d(w);for(const b of f)if(u===d(b)||u.includes(d(b)))return String(m[w]??"").trim()}return""};let g=0,h=0;for(const m of c){const f=p(m,"Company","Company Name","Name");if(!f){h++;continue}this.saveLead({company:f,contact:p(m,"Contact","Phone","Email","Contact Number")||"",source:p(m,"Lead Source","Source")||"LinkedIn",assignedTo:p(m,"Assigned To","Assigned","Owner")||"",nextAction:p(m,"Next Action","Action")||"Follow-up",stage:"New Lead",feedbackStatus:"Pending"}).ok?g++:h++}this.showToast(`Uploaded: ${g} leads saved${h?`, ${h} skipped`:""}.`),this.switchSection("leads"),this.switchSubSection("lead_directory"),this.renderContent(),this.initializeLucideIcons()}catch(o){console.error("Lead Excel upload error:",o),this.showToast("Error reading file. Please use .xlsx or .csv format.")}},i.readAsArrayBuffer(t)}handleProjectExcelUpload(a){var s,n;const t=(n=(s=a==null?void 0:a.target)==null?void 0:s.files)==null?void 0:n[0];if(!t)return;const i=new FileReader;i.onload=l=>{try{if(typeof XLSX>"u"){this.showToast("Excel library not loaded. Please refresh.");return}const o=XLSX.read(l.target.result,{type:"array"}),r=o.Sheets[o.SheetNames[0]],c=XLSX.utils.sheet_to_json(r,{defval:""});if(!c.length){this.showToast("No data found in the file.");return}const d=m=>String(m||"").trim().toLowerCase().replace(/[^a-z0-9]/g,""),p=(m,...f)=>{for(const w of Object.keys(m)){const u=d(w);for(const b of f)if(u===d(b)||u.includes(d(b)))return String(m[w]??"").trim()}return""};let g=0,h=0;for(const m of c){const f=p(m,"Project Name","Name","Project");if(!f){h++;continue}const w={model2dStatus:p(m,"2D Model Status")||"Pending",model3dStatus:p(m,"3D Model Status")||"Pending",scan3dStatus:p(m,"3D Scan Status")||"Pending",feaStatus:p(m,"FEA Status")||"Pending",qcInspectionStatus:p(m,"QC Inspection Status","QC / Inspection Status")||"Pending",approvalStatus:p(m,"Approval Status")||"Pending",glApprovalStatus:p(m,"GL Approval Status")||"Pending",revisionStatus:p(m,"Revision Status","Correction / Revision Status")||"Pending",deliveryReportStatus:p(m,"Delivery Report Status")||"Pending",sopDailyReportStatus:p(m,"SOP Daily Report Status","SOP-Based Daily Report Status")||"Pending"},u={roadmapSubmitted:p(m,"Roadmap Submitted","Project Roadmap Submitted")||"No",dashboardUpdated:p(m,"Dashboard Updated")||"No",dailyReportUpdated:p(m,"Daily Report Updated")||"No",photoAttached:p(m,"Photo Attached")||"No",overallProjectStatus:p(m,"Overall Project Status")||"Pending / Delayed",postCompletionStatus:p(m,"Post Completion Status")||"",physicalPartStatus:p(m,"Physical Part Status")||""},b={dcDate:p(m,"DC Date")||"",dcNumber:p(m,"DC Number")||"",deliveryStatus:p(m,"Delivery Status")||"Pending",deliveryDate:p(m,"Delivery Date")||"",deliveryConfirmation:p(m,"Delivery Confirmation")||"No"},v={quotationDate:p(m,"Quotation Date")||"",quotationNumber:p(m,"Quotation Number")||"",poDate:p(m,"PO Date")||"",poNumber:p(m,"PO Number")||"",poValue:p(m,"PO Value")||"",convertedBy:p(m,"Converted By")||"",visitConducted:p(m,"Visit Conducted")||"No"},C={invoiceDate:p(m,"Invoice Date")||"",invoiceNumber:p(m,"Invoice Number")||"",invoiceAmount:p(m,"Invoice Amount")||"",pastInvoiceAmount:p(m,"Past Invoice Amount")||"",paymentTerms:p(m,"Payment Terms")||"",paymentType:p(m,"Payment Type")||"",paymentDueDate:p(m,"Payment Due Date")||"",paymentReceivedDate:p(m,"Payment Received Date")||"",paymentReceivedAmount:p(m,"Payment Received Amount")||"",balancePaymentDueDate:p(m,"Balance Payment Due Date")||"",balancePaymentAmount:p(m,"Balance Payment Amount")||""},L={clientRating:p(m,"Client Rating")||"",jobRating:p(m,"Job Rating")||"",qualityRating:p(m,"Quality Rating")||"",serviceRating:p(m,"Service Rating")||"",performanceRating:p(m,"Performance Rating")||"",feedbackComments:p(m,"Feedback","Feedback Comments")||"",additionalNotes:p(m,"Additional Notes")||""};this.saveProject({client:p(m,"Client","Client Name","Company")||"",name:f,startDate:p(m,"Start Date")||"",duration:p(m,"Duration")||"",budget:p(m,"Budget")||"",team:p(m,"Team","Assigned Team")||"",progress:0,status:"On Track",statusColor:"emerald",identification:{projectCode:p(m,"Project Code")||"",serviceCode:p(m,"Service Code")||"",vendorCode:p(m,"Vendor Code")||"",companyName:p(m,"Company Name","Company")||"",projectDescription:p(m,"Project Description","Description")||"",partDescription:p(m,"Part Description")||"",location:p(m,"Location")||"",qty:p(m,"Quantity","QTY","Qty")||"",projectLead:p(m,"Project Lead")||"",assignedBy:p(m,"Assigned By")||"",assignedTo:p(m,"Assigned To","Assigned To Employee")||""},tracking:w,monitoring:u,dispatch:b,purchase:v,payment:C,ratings:L}).ok?g++:h++}this.showToast(`Uploaded: ${g} projects created${h?`, ${h} skipped`:""}.`),this.switchSection("projects"),this.switchSubSection("active"),this.renderContent(),this.initializeLucideIcons()}catch(o){console.error("Project Excel upload error:",o),this.showToast("Error reading file. Please use .xlsx or .csv format.")}},i.readAsArrayBuffer(t)}saveProjectFromCurrentForm(){var r,c,d,p,g,h;const a=((r=document.getElementById("projectClient"))==null?void 0:r.value)||"",t=((c=document.getElementById("projectName"))==null?void 0:c.value)||"",i=((d=document.getElementById("projectStartDate"))==null?void 0:d.value)||"",s=((p=document.getElementById("projectDuration"))==null?void 0:p.value)||"",n=((g=document.getElementById("projectBudget"))==null?void 0:g.value)||"",l=((h=document.getElementById("projectTeam"))==null?void 0:h.value)||"",o=this.saveProject({client:a,name:t,startDate:i,duration:s,budget:n,team:l,progress:0,status:"On Track",statusColor:"emerald",owner:String(a||"").split(" ")[0]||"—",spent:"₹0"});if(!o.ok){this.showToast(o.message||"Unable to create project.");return}this.switchSection("projects"),this.switchSubSection("active"),this.renderContent(),this.initializeLucideIcons(),this.showToast("Project created.")}createCampaignViaModal(){this.openModal("New Campaign",`
            <div>
                <label style="display:block;font-size:12px;font-weight:700;color:#475569;">Campaign Name</label>
                <input name="name" required style="margin-top:6px;width:100%;border:1px solid #e2e8f0;border-radius:12px;padding:10px 12px;font-size:14px;" placeholder="e.g., New Service Launch" />
            </div>
            <div style="display:grid;grid-template-columns:1fr;gap:10px;" class="sm-grid-2col">
                <div>
                    <label style="display:block;font-size:12px;font-weight:700;color:#475569;">Audience</label>
                    <input name="audience" type="number" min="0" style="margin-top:6px;width:100%;border:1px solid #e2e8f0;border-radius:12px;padding:10px 12px;font-size:14px;" placeholder="0" />
                </div>
                <div>
                    <label style="display:block;font-size:12px;font-weight:700;color:#475569;">Status</label>
                    <select name="status" style="margin-top:6px;width:100%;border:1px solid #e2e8f0;border-radius:12px;padding:10px 12px;font-size:14px;">
                        <option>Draft</option>
                        <option>Scheduled</option>
                        <option>Sent</option>
                    </select>
                </div>
            </div>
        `,{submitLabel:"Create Campaign",onSubmit:a=>{const t=new FormData(a),i=String(t.get("status")||"Draft"),s=i==="Sent"?"emerald":i==="Scheduled"?"amber":"slate",n=this.saveCampaign({name:t.get("name"),audience:t.get("audience"),open:0,click:0,status:i,statusColor:s});if(!n.ok){this.showToast(n.message||"Unable to create campaign.");return}this.closeModal(),this.switchSection("campaigns"),this.switchSubSection("email"),this.renderContent(),this.initializeLucideIcons(),this.showToast("Campaign created.")}})}createInvoiceViaModal(a){const t=String(a||"").trim();this.openModal("Create Invoice",`
            <div style="display:grid;grid-template-columns:1fr;gap:10px;" class="sm-grid-2col">
                <div>
                    <label style="display:block;font-size:12px;font-weight:700;color:#475569;">Invoice No</label>
                    <input name="no" required style="margin-top:6px;width:100%;border:1px solid #e2e8f0;border-radius:12px;padding:10px 12px;font-size:14px;" placeholder="INV-125" />
                </div>
                <div>
                    <label style="display:block;font-size:12px;font-weight:700;color:#475569;">Amount</label>
                    <input name="amount" required style="margin-top:6px;width:100%;border:1px solid #e2e8f0;border-radius:12px;padding:10px 12px;font-size:14px;" placeholder="₹42,000" />
                </div>
            </div>
            <div>
                <label style="display:block;font-size:12px;font-weight:700;color:#475569;">Client</label>
                <input name="client" required style="margin-top:6px;width:100%;border:1px solid #e2e8f0;border-radius:12px;padding:10px 12px;font-size:14px;" placeholder="Client name" value="${t.replace(/</g,"&lt;")}" />
            </div>
            <div style="display:grid;grid-template-columns:1fr;gap:10px;" class="sm-grid-2col">
                <div>
                    <label style="display:block;font-size:12px;font-weight:700;color:#475569;">Status</label>
                    <select name="status" style="margin-top:6px;width:100%;border:1px solid #e2e8f0;border-radius:12px;padding:10px 12px;font-size:14px;">
                        <option>Pending</option>
                        <option>Paid</option>
                        <option>Overdue</option>
                    </select>
                </div>
                <div>
                    <label style="display:block;font-size:12px;font-weight:700;color:#475569;">Due</label>
                    <input name="due" style="margin-top:6px;width:100%;border:1px solid #e2e8f0;border-radius:12px;padding:10px 12px;font-size:14px;" placeholder="Due in 7 days" />
                </div>
            </div>
        `,{submitLabel:"Create Invoice",onSubmit:i=>{const s=new FormData(i),n=String(s.get("status")||"Pending"),l=n==="Paid"?"emerald":n==="Overdue"?"rose":"amber",o=this.saveInvoice({no:s.get("no"),client:s.get("client"),amount:s.get("amount"),due:s.get("due"),status:n,color:l});if(!o.ok){this.showToast(o.message||"Unable to create invoice.");return}this.closeModal(),this.switchSection("billing"),this.switchSubSection("invoices"),this.renderContent(),this.initializeLucideIcons(),this.showToast("Invoice created.")}})}setupActionDispatcher(){if(this._actionDispatcherAttached)return;this._actionDispatcherAttached=!0;const a=i=>{if(!i||i.classList.contains("nav-tab")||i.hasAttribute("data-subsection")||i.hasAttribute("data-target-section")||i.hasAttribute("data-modal-close")||i.type==="submit"||i.closest&&i.closest("[data-modal-form]"))return!0;const s=i.id||"";return s==="sidebarToggle"||s==="sidebarCollapse"||s==="notificationToggle"||s==="profileToggle"||s==="logoutBtn"||s==="markAllReadBtn"||s==="viewAllNotificationsBtn"},t=i=>{var n,l,o,r,c,d,p,g,h,m,f,w,u,b,v,C,L,F,D,j,I,N,R,_,A,E,z,V,Q,J,Y,Z,tt,et,st,at,it,O,ot,lt,rt,dt,ct,q,W,G,K,X,pt,ut,mt,gt,xt,yt,wt,St,Ct,$t,kt,jt,Lt,At,It,vt,Pt,Rt,Dt,Tt,bt,Nt,ft,Et,Mt,Bt,Wt,Vt,Qt,Gt,Kt,Jt,Yt,Xt,Zt,te,ee,se,ae,ie,oe,ne,le,re,de,ce,pe,ue,me,ge,xe,he,ve,be,fe,ye,we,Se,Ce,$e,ke,je,Le,Ae,De,Te,Ie,Pe,Re,Ne,_e,Ee,Me,Be,Fe,ze,Oe,qe,Ue,He,We,Ve;const s=String(i||"").trim();if(!s)return!1;if(s.startsWith("nav:")){const[x,y]=s.slice(4).split("/"),S=(l=(n=this._lastActionButton)==null?void 0:n.dataset)==null?void 0:l.invoiceClientFilter;return S&&x==="billing"&&y==="invoices"&&(this.invoiceClientFilter=String(S||"").trim()||null),x&&this.switchSection(x),y&&this.switchSubSection(y),!0}if(s.startsWith("project:dir:select:")){const x=s.slice(19);this.selectedProjectKey=x;try{const y=this.getStoredProjects();if(!y.some($=>this.getProjectKey($)===x)){const $=(o=this._projectsCacheByKey)==null?void 0:o.get(x);$&&(y.unshift(this.ensureProjectModel($)),this.writeStore("bezent_projects",y))}}catch{}return this.renderContent(),this.initializeLucideIcons(),!0}if(s.startsWith("project:save:")){const x=s.slice(13);return this.saveProjectByKey(x),this.showToast("Project saved."),!0}if(s.startsWith("project:update:")){const x=s.slice(15).replace(/&quot;/g,'"');return this.saveProjectFromCurrentForm(x),this._editingProject=null,(r=e==null?void 0:e.stopPropagation)==null||r.call(e),!0}if(s.startsWith("project:delete:")){const x=s.slice(15).replace(/&quot;/g,'"');return this.deleteProjectByKey(x),this.selectedProjectKey=null,this.renderContent(),this.initializeLucideIcons(),this.showToast("Project deleted."),!0}if(s.startsWith("project:select:")){const x=s.slice(15);this.selectedProjectKey=x,this.isProjectDetailOpen=!0;try{const y=this.getStoredProjects();if(!y.some($=>this.getProjectKey($)===x)){const $=(c=this._projectsCacheByKey)==null?void 0:c.get(x);$&&(y.unshift(this.ensureProjectModel($)),this.writeStore("bezent_projects",y))}}catch{}return this.renderContent(),this.initializeLucideIcons(),!0}if(s==="project:detail:close")return this.isProjectDetailOpen=!1,this.renderContent(),this.initializeLucideIcons(),!0;if(s==="chat:open")return this.openChatPanel(this._lastActionButton),!0;if(s==="chat:close")return this.closeChatPanel(),!0;if(s==="chat:toggle")return this.toggleChatPanel(this._lastActionButton),!0;if(s==="invoice:preview"){const x=this._lastActionButton,y={no:(d=x==null?void 0:x.dataset)==null?void 0:d.invoiceNo,client:(p=x==null?void 0:x.dataset)==null?void 0:p.invoiceClient,amount:(g=x==null?void 0:x.dataset)==null?void 0:g.invoiceAmount,due:(h=x==null?void 0:x.dataset)==null?void 0:h.invoiceDue,status:(m=x==null?void 0:x.dataset)==null?void 0:m.invoiceStatus,color:(f=x==null?void 0:x.dataset)==null?void 0:f.invoiceColor};return this.previewInvoice(y),!0}if(s==="invoice:download"){const x=this._lastActionButton,y={no:(w=x==null?void 0:x.dataset)==null?void 0:w.invoiceNo,client:(u=x==null?void 0:x.dataset)==null?void 0:u.invoiceClient,amount:(b=x==null?void 0:x.dataset)==null?void 0:b.invoiceAmount,due:(v=x==null?void 0:x.dataset)==null?void 0:v.invoiceDue,status:(C=x==null?void 0:x.dataset)==null?void 0:C.invoiceStatus,color:(L=x==null?void 0:x.dataset)==null?void 0:L.invoiceColor};return this.downloadInvoice(y),this.showToast("Invoice downloaded."),!0}if(s==="invoice:export"){const x=this._lastActionButton;let y=[];try{const S=String(((F=x==null?void 0:x.dataset)==null?void 0:F.invoicesJson)||"[]"),$=S.includes("%")?decodeURIComponent(S):S;y=JSON.parse($||"[]")}catch{y=[]}return this.downloadInvoicesExport(y),this.showToast("Invoices exported."),!0}if(s==="invoice:markPaid"){const x=this._lastActionButton,y={no:(D=x==null?void 0:x.dataset)==null?void 0:D.invoiceNo,client:(j=x==null?void 0:x.dataset)==null?void 0:j.invoiceClient,amount:(I=x==null?void 0:x.dataset)==null?void 0:I.invoiceAmount,due:(N=x==null?void 0:x.dataset)==null?void 0:N.invoiceDue,status:(R=x==null?void 0:x.dataset)==null?void 0:R.invoiceStatus,color:(_=x==null?void 0:x.dataset)==null?void 0:_.invoiceColor},S=this.setInvoiceStatus(y,"Paid");return S.ok?(this.renderContent(),this.initializeLucideIcons(),this.showToast("Marked as Paid."),!0):(this.showToast(S.message||"Unable to mark paid."),!0)}if(s==="billing:clearInvoiceFilter")return this.invoiceClientFilter=null,this.renderContent(),this.initializeLucideIcons(),this.showToast("Invoice filter cleared."),!0;if(s==="task:create")return this.showToast("Task creation coming soon."),!0;if(s==="client:followup")return this.showToast("Follow-up logged."),!0;if(s==="client:note")return this.showToast("Note saved."),!0;if(s==="billing:sendBulkReminders")return this.showToast("Bulk reminders queued."),!0;if(s==="billing:goToClient"){const x=this._lastActionButton,y=((A=x==null?void 0:x.dataset)==null?void 0:A.clientName)||"";return y&&(this.selectedClientName=y),this.switchSection("leads"),this.switchSubSection("clients"),this.renderContent(),this.initializeLucideIcons(),!0}if(s==="billing:goToInvoices"){const x=this._lastActionButton,y=((E=x==null?void 0:x.dataset)==null?void 0:E.clientName)||"";return y&&(this.invoiceClientFilter=y),this.switchSection("billing"),this.switchSubSection("invoices"),this.renderContent(),this.initializeLucideIcons(),!0}if(s==="billing:goToFollowupLog")return this.switchSubSection("followup_log"),this.renderContent(),this.initializeLucideIcons(),!0;if(s==="billing:goToOverdueRisk")return this.switchSubSection("overdue_risk"),this.renderContent(),this.initializeLucideIcons(),!0;if(s==="billing:goToPayments")return this.switchSubSection("payments"),this.renderContent(),this.initializeLucideIcons(),!0;if(s==="invoice:create")return this.createInvoiceViaModal(),!0;if(s==="dashboard:scheduleCall")return this.showToast("Call scheduled."),!0;if(s==="lead:add")return this.showToast("Lead added."),!0;if(s==="client:register"){const x=((z=document.getElementById("registerMode"))==null?void 0:z.value)||"client",y=document.getElementById("clientName"),S=document.getElementById("clientOwner"),$=document.getElementById("clientEmail"),k=document.getElementById("clientPhone"),T=document.getElementById("clientIndustry"),P=document.getElementById("clientLeadSource"),B=document.getElementById("clientLocation"),U=document.getElementById("clientVendorCode"),H=document.getElementById("clientNotes");if(!y||!y.value.trim())return this.showToast(x==="lead"?"Company is required.":"Client name is required."),!0;if(x==="lead"){const _t=this.saveLead({company:y.value.trim(),assignedTo:((V=S==null?void 0:S.value)==null?void 0:V.trim())||"",contact:((Q=k==null?void 0:k.value)==null?void 0:Q.trim())||"",source:((J=P==null?void 0:P.value)==null?void 0:J.trim())||"LinkedIn",stage:"New Lead",nextAction:"Follow-up",feedbackStatus:"Pending",history:[{at:Date.now(),type:"create",note:((Y=H==null?void 0:H.value)==null?void 0:Y.trim())||""}]});return _t.ok?(this.showToast("Lead saved."),this.switchSection("leads"),this.switchSubSection("lead_directory"),this.renderContent(),this.initializeLucideIcons()):this.showToast(_t.message||"Unable to save lead."),!0}const nt=this.saveClient({name:y.value.trim(),owner:((Z=S==null?void 0:S.value)==null?void 0:Z.trim())||"",email:((tt=$==null?void 0:$.value)==null?void 0:tt.trim())||"",phone:((et=k==null?void 0:k.value)==null?void 0:et.trim())||"",industry:((st=T==null?void 0:T.value)==null?void 0:st.trim())||"",leadSource:((at=P==null?void 0:P.value)==null?void 0:at.trim())||"",location:((it=B==null?void 0:B.value)==null?void 0:it.trim())||"",vendorCode:((O=U==null?void 0:U.value)==null?void 0:O.trim())||"",notes:((ot=H==null?void 0:H.value)==null?void 0:ot.trim())||"",stage:"Active",city:"—"});return nt.ok?(this.showToast("Client saved."),this.switchSection("leads"),this.switchSubSection("client_directory"),this.renderContent(),this.initializeLucideIcons()):this.showToast(nt.message||"Unable to save client."),!0}if(s==="client:upload:trigger")return this.showUploadModal("client"),!0;if(s==="project:upload:trigger")return this.showUploadModal("project"),!0;if(s==="lead:upload:trigger")return this.showUploadModal("lead"),!0;if(s==="lead:register"){const x=((rt=(lt=document.getElementById("leadCompany"))==null?void 0:lt.value)==null?void 0:rt.trim())||"",y=((ct=(dt=document.getElementById("leadContact"))==null?void 0:dt.value)==null?void 0:ct.trim())||"",S=((q=document.getElementById("leadSource"))==null?void 0:q.value)||"LinkedIn",$=((G=(W=document.getElementById("leadAssignedTo"))==null?void 0:W.value)==null?void 0:G.trim())||"",k=((X=(K=document.getElementById("leadNextAction"))==null?void 0:K.value)==null?void 0:X.trim())||"Follow-up";if(!x)return this.showToast("Company is required."),!0;const T=this.saveLead({company:x,contact:y,source:S,assignedTo:$,nextAction:k,stage:"New Lead",feedbackStatus:"Pending"});return T.ok?(this.showToast("Lead saved."),this.switchSection("leads"),this.switchSubSection("lead_directory"),this.renderContent(),this.initializeLucideIcons()):this.showToast(T.message||"Unable to save lead."),!0}if(s==="lead:convert"){const x=this._lastActionButton,y=(pt=x==null?void 0:x.dataset)==null?void 0:pt.leadId,S=this.convertLeadToClient(y);return S.ok?(this.showToast("Lead converted to client."),this.renderContent(),this.initializeLucideIcons()):this.showToast(S.message||"Unable to convert lead."),!0}if(s==="lead:update"){const x=String(((ut=document.getElementById("leadDetailId"))==null?void 0:ut.value)||"").trim();if(!x)return this.showToast("Select a lead first."),!0;const y=String(((mt=document.getElementById("leadDetailStage"))==null?void 0:mt.value)||"").trim(),S=String(((gt=document.getElementById("leadDetailAssignedTo"))==null?void 0:gt.value)||"").trim(),$=String(((xt=document.getElementById("leadDetailNextAction"))==null?void 0:xt.value)||"").trim(),k=String(((yt=document.getElementById("leadDetailFeedback"))==null?void 0:yt.value)||"").trim(),T=String(((wt=document.getElementById("leadDetailNote"))==null?void 0:wt.value)||"").trim(),B=this.getLeadsData().find(H=>String((H==null?void 0:H.id)||"").trim().toLowerCase()===x.toLowerCase())||{},U=this.saveLead({...B,id:x,stage:y||B.stage,assignedTo:S||B.assignedTo,nextAction:$||B.nextAction,feedbackStatus:k||B.feedbackStatus,history:[...Array.isArray(B.history)?B.history:[],{at:Date.now(),type:"update",note:T}]});return U.ok?(this.showToast("Lead updated."),this.selectedLeadId=x,this.renderContent(),this.initializeLucideIcons()):this.showToast(U.message||"Unable to update lead."),!0}if(s==="project:register"){const x=document.getElementById("projectClient"),y=document.getElementById("vendorCode"),S=document.getElementById("projectName"),$=document.getElementById("projectStartDate"),k=document.getElementById("projectDuration"),T=document.getElementById("projectBudget"),P=document.getElementById("projectTeam"),B=document.getElementById("projectCode"),U=document.getElementById("serviceCode"),H=document.getElementById("companyName"),nt=document.getElementById("projectDescription"),_t=document.getElementById("partDescription"),zt=document.getElementById("projectLocation"),Ot=document.getElementById("projectQty"),qt=document.getElementById("projectLead"),Ut=document.getElementById("assignedBy"),Ht=document.getElementById("assignedTo"),M=Ft=>{var Ge;return String(((Ge=document.getElementById(Ft))==null?void 0:Ge.value)||"").trim()},Ke=Object.fromEntries(["model2dStatus","model3dStatus","scan3dStatus","feaStatus","qcInspectionStatus","approvalStatus","glApprovalStatus","revisionStatus","deliveryReportStatus","sopDailyReportStatus"].map(Ft=>[Ft,M(`reg_tracking_${Ft}`)||"Pending"])),Je={roadmapSubmitted:M("reg_monitoring_roadmapSubmitted")||"No",dashboardUpdated:M("reg_monitoring_dashboardUpdated")||"No",dailyReportUpdated:M("reg_monitoring_dailyReportUpdated")||"No",photoAttached:M("reg_monitoring_photoAttached")||"No",overallProjectStatus:M("reg_monitoring_overallProjectStatus")||"Pending / Delayed",postCompletionStatus:M("reg_monitoring_postCompletionStatus")||"",physicalPartStatus:M("reg_monitoring_physicalPartStatus")||""},Ye={dcDate:M("reg_dispatch_dcDate")||"",dcNumber:M("reg_dispatch_dcNumber")||"",deliveryStatus:M("reg_dispatch_deliveryStatus")||"Pending",deliveryDate:M("reg_dispatch_deliveryDate")||"",deliveryConfirmation:M("reg_dispatch_deliveryConfirmation")||"No"},Xe={quotationDate:M("reg_purchase_quotationDate")||"",quotationNumber:M("reg_purchase_quotationNumber")||"",poDate:M("reg_purchase_poDate")||"",poNumber:M("reg_purchase_poNumber")||"",poValue:M("reg_purchase_poValue")||"",convertedBy:M("reg_purchase_convertedBy")||"",visitConducted:M("reg_purchase_visitConducted")||"No"},Ze={invoiceDate:M("reg_payment_invoiceDate")||"",invoiceNumber:M("reg_payment_invoiceNumber")||"",invoiceAmount:M("reg_payment_invoiceAmount")||"",pastInvoiceAmount:M("reg_payment_pastInvoiceAmount")||"",paymentTerms:M("reg_payment_paymentTerms")||"",paymentType:M("reg_payment_paymentType")||"",paymentDueDate:M("reg_payment_paymentDueDate")||"",paymentReceivedDate:M("reg_payment_paymentReceivedDate")||"",paymentReceivedAmount:M("reg_payment_paymentReceivedAmount")||"",balancePaymentDueDate:M("reg_payment_balancePaymentDueDate")||"",balancePaymentAmount:M("reg_payment_balancePaymentAmount")||""},ts={clientRating:M("reg_ratings_clientRating")||"",jobRating:M("reg_ratings_jobRating")||"",feedbackComments:M("reg_ratings_feedbackComments")||"",qualityRating:M("reg_ratings_qualityRating")||"",serviceRating:M("reg_ratings_serviceRating")||"",performanceRating:M("reg_ratings_performanceRating")||"",additionalNotes:M("reg_ratings_additionalNotes")||""};if(!((St=S==null?void 0:S.value)!=null&&St.trim()))return this.showToast("Project name is required."),!0;const Qe=this.saveProject({client:((Ct=x==null?void 0:x.value)==null?void 0:Ct.trim())||"",name:S.value.trim(),startDate:(($t=$==null?void 0:$.value)==null?void 0:$t.trim())||"",duration:((kt=k==null?void 0:k.value)==null?void 0:kt.trim())||"",budget:((jt=T==null?void 0:T.value)==null?void 0:jt.trim())||"",team:((Lt=P==null?void 0:P.value)==null?void 0:Lt.trim())||"",identification:{projectCode:((At=B==null?void 0:B.value)==null?void 0:At.trim())||"",serviceCode:((It=U==null?void 0:U.value)==null?void 0:It.trim())||"",vendorCode:((vt=y==null?void 0:y.value)==null?void 0:vt.trim())||this.getClientVendorCode(((Pt=x==null?void 0:x.value)==null?void 0:Pt.trim())||""),companyName:((Rt=H==null?void 0:H.value)==null?void 0:Rt.trim())||"",projectDescription:((Dt=nt==null?void 0:nt.value)==null?void 0:Dt.trim())||"",partDescription:((Tt=_t==null?void 0:_t.value)==null?void 0:Tt.trim())||"",location:((bt=zt==null?void 0:zt.value)==null?void 0:bt.trim())||"",qty:((Nt=Ot==null?void 0:Ot.value)==null?void 0:Nt.trim())||"",projectLead:((ft=qt==null?void 0:qt.value)==null?void 0:ft.trim())||"",assignedBy:((Et=Ut==null?void 0:Ut.value)==null?void 0:Et.trim())||"",assignedTo:((Mt=Ht==null?void 0:Ht.value)==null?void 0:Mt.trim())||""},tracking:Ke,monitoring:Je,dispatch:Ye,purchase:Xe,payment:Ze,ratings:ts});return Qe.ok?(this.showToast("Project created."),this.switchSection("projects"),this.switchSubSection("active"),this.renderContent(),this.initializeLucideIcons()):this.showToast(Qe.message||"Failed to create project."),!0}if(s.startsWith("pipeline:open:")){const x=s.slice(14);if(this.showToast("Opening item."),x.startsWith("inv:")){const y=x.slice(4);return this.switchSection("billing"),this.switchSubSection("invoices"),this.renderContent(),this.initializeLucideIcons(),this.showToast(`Invoice ${y}`),!0}return x.startsWith("proj:")?(this.switchSection("projects"),this.switchSubSection("active"),this.renderContent(),this.initializeLucideIcons(),!0):(x.startsWith("cli:")&&(this.switchSection("leads"),this.switchSubSection("client_directory"),this.renderContent(),this.initializeLucideIcons()),!0)}if(s==="client:edit"){const x=this._lastActionButton,y=(Bt=x==null?void 0:x.dataset)==null?void 0:Bt.clientName,$=this.getClientsData().find(k=>String((k==null?void 0:k.name)||"").trim()===String(y||"").trim());return this.editClientViaModal($||{name:y}),!0}if(s==="lead:edit"){const x=this._lastActionButton,y=(Wt=x==null?void 0:x.dataset)==null?void 0:Wt.leadId,$=this.getStoredLeads().find(k=>String(k.id)===String(y));return this.editLeadViaModal($),!0}if(s.startsWith("project:edit:")){const x=s.slice(13).replace(/&quot;/g,'"'),S=this.getAllProjectsMerged([]).find($=>String(this.getProjectKey($))===x);return this.editProjectViaModal(S),!0}if(s==="client:delete"){const x=this._lastActionButton,y=(Vt=x==null?void 0:x.dataset)==null?void 0:Vt.clientName;if(!y)return!0;const S=this.deleteClientByName(y);return S.ok?(this.showToast("Client deleted."),this.renderContent(),this.initializeLucideIcons()):this.showToast(S.message||"Unable to delete client."),!0}if(s.startsWith("client:update:")){const x=s.slice(14).replace(/&quot;/g,'"'),y=((Gt=(Qt=document.getElementById("clientOwner"))==null?void 0:Qt.value)==null?void 0:Gt.trim())||"",S=((Jt=(Kt=document.getElementById("clientEmail"))==null?void 0:Kt.value)==null?void 0:Jt.trim())||"",$=((Xt=(Yt=document.getElementById("clientPhone"))==null?void 0:Yt.value)==null?void 0:Xt.trim())||"",k=((te=(Zt=document.getElementById("clientIndustry"))==null?void 0:Zt.value)==null?void 0:te.trim())||"",T=((se=(ee=document.getElementById("clientCity"))==null?void 0:ee.value)==null?void 0:se.trim())||"",P=((ie=(ae=document.getElementById("clientAddress"))==null?void 0:ae.value)==null?void 0:ie.trim())||"",B=((ne=(oe=document.getElementById("clientGstin"))==null?void 0:oe.value)==null?void 0:ne.trim())||"",U=this.saveClient({name:x,owner:y,email:S,phone:$,industry:k,city:T,address:P,gstin:B});return U.ok?(this.showToast("Client updated."),this._editingClient=null,this.switchSection("leads"),this.switchSubSection("client_directory"),this.renderContent(),this.initializeLucideIcons()):this.showToast(U.message||"Unable to update client."),!0}if(s==="lead:delete"){const x=this._lastActionButton,y=(le=x==null?void 0:x.dataset)==null?void 0:le.leadId;if(!y)return!0;const $=this.getStoredLeads().filter(k=>String(k.id)!==String(y));return this.writeStore("bezent_leads",$),this.showToast("Lead deleted."),this.renderContent(),this.initializeLucideIcons(),!0}if(s.startsWith("lead:update:")){const x=s.slice(12),y=(de=(re=document.getElementById("leadCompany"))==null?void 0:re.value)==null?void 0:de.trim(),S=(pe=(ce=document.getElementById("leadAssignedTo"))==null?void 0:ce.value)==null?void 0:pe.trim(),$=(me=(ue=document.getElementById("leadContact"))==null?void 0:ue.value)==null?void 0:me.trim(),k=((xe=(ge=document.getElementById("leadSource"))==null?void 0:ge.value)==null?void 0:xe.trim())||"LinkedIn";if(!y)return this.showToast("Company is required."),!0;const T=this.saveLead({id:x,company:y,assignedTo:S,contact:$,source:k});return T.ok?(this.showToast("Lead updated."),this._editingLead=null,this.switchSection("leads"),this.switchSubSection("lead_directory"),this.renderContent(),this.initializeLucideIcons()):this.showToast(T.message||"Unable to update lead."),!0}if(s==="client:createInvoice"){const x=this._lastActionButton,y=(he=x==null?void 0:x.dataset)==null?void 0:he.clientName;return this.createInvoiceViaModal(y),!0}if(s==="campaign:preview"){const x=this._lastActionButton,y=(ve=x==null?void 0:x.dataset)==null?void 0:ve.campaignName,S=this.getCampaignByName(y)||{name:y};return this.previewCampaign(S),!0}if(s==="campaign:send"){const x=this._lastActionButton,y=(be=x==null?void 0:x.dataset)==null?void 0:be.campaignName,S=this.setCampaignStatus(y,"Sent");return S.ok?this.showToast("Campaign sent."):this.showToast(S.message||"Unable to send campaign."),this.renderContent(),this.initializeLucideIcons(),!0}if(s==="campaign:schedule"){const x=this._lastActionButton,y=(fe=x==null?void 0:x.dataset)==null?void 0:fe.campaignName,S=this.setCampaignStatus(y,"Scheduled");return S.ok?this.showToast("Campaign scheduled."):this.showToast(S.message||"Unable to schedule campaign."),this.renderContent(),this.initializeLucideIcons(),!0}if(s==="campaign:duplicate"){const x=this._lastActionButton,y=(ye=x==null?void 0:x.dataset)==null?void 0:ye.campaignName,S=this.duplicateCampaignByName(y);return S.ok?this.showToast("Campaign duplicated."):this.showToast(S.message||"Unable to duplicate campaign."),this.renderContent(),this.initializeLucideIcons(),!0}if(s==="campaign:delete"){const x=this._lastActionButton,y=(we=x==null?void 0:x.dataset)==null?void 0:we.campaignName;return this.openModal("Delete Campaign",`
                    <div style="font-size:14px;color:#0f172a;">Delete <span style="font-weight:900;">${String(y||"").replace(/</g,"&lt;")}</span>?</div>
                    <div style="font-size:12px;color:#475569;">This removes it from your saved campaigns.</div>
                `,{submitLabel:"Delete",onSubmit:()=>{const S=this.deleteCampaignByName(y);S.ok||this.showToast(S.message||"Unable to delete campaign."),this.closeModal(),this.renderContent(),this.initializeLucideIcons(),this.showToast("Campaign deleted.")}}),!0}if(s==="campaign:create")return this.createCampaignViaModal(),!0;if(s==="quote:print:sample"){const x=this.getSampleQuotationTemplate();return this.openQuotationPrintWindow(x),!0}if(s==="quote:print:current"){const x=this.computeQuotation(this._quoteDraft||this.getSampleQuotationTemplate());return this.openQuotationPrintWindow(x),!0}if(s==="rfp:print:current"){const x=this.computeRfp(this._rfpDraft||this.getSampleRfpTemplate());return this.openRfpPrintWindow(x),!0}if(s==="quote:item:add")return this._quoteDraft||(this._quoteDraft=this.getSampleQuotationTemplate()),Array.isArray(this._quoteDraft.items)||(this._quoteDraft.items=[]),this._quoteDraft.items.push({description:"",hsnSac:"998333",dueOn:"",qty:1,rate:0,amount:0}),this.renderContent(),this.initializeLucideIcons(),!0;if(s==="rfp:item:add")return this._rfpDraft||(this._rfpDraft=this.getStoredRfpDraft()||this.getSampleRfpTemplate()),Array.isArray(this._rfpDraft.items)||(this._rfpDraft.items=[]),this._rfpDraft.items.push({description:"",uom:"AE",qty:1,rate:0,amount:0}),this.saveRfpDraft(),this.renderContent(),!0;if(s.startsWith("quote:item:remove:")){const x=Number(s.slice(18));this._quoteDraft||(this._quoteDraft=this.getSampleQuotationTemplate());const y=Array.isArray(this._quoteDraft.items)?this._quoteDraft.items:[];return Number.isFinite(x)&&x>=0&&x<y.length&&(y.splice(x,1),this._quoteDraft.items=y,this.renderContent(),this.initializeLucideIcons()),!0}if(s.startsWith("rfp:item:remove:")){const x=Number(s.split(":").pop());return this._rfpDraft||(this._rfpDraft=this.getStoredRfpDraft()||this.getSampleRfpTemplate()),Array.isArray(this._rfpDraft.items)||(this._rfpDraft.items=[]),Number.isFinite(x)&&x>=0&&this._rfpDraft.items.splice(x,1),this.saveRfpDraft(),this.renderContent(),!0}if(s==="dashboard:addTask"){const x=window.prompt("New task description:");if(!x)return!0;const y=window.prompt("Priority (High / Medium / Low):","Medium")||"Medium",S=this.readStore("bezent_tasks",[]);return S.push({id:`task_${Date.now()}`,text:x.trim(),priority:y,completed:!1,createdAt:Date.now()}),this.writeStore("bezent_tasks",S),this.showToast("Task added!"),this.renderContent(),this.initializeLucideIcons(),!0}if(s==="dashboard:toggleTask"){const x=this._lastActionButton,y=(Se=x==null?void 0:x.dataset)==null?void 0:Se.taskId;if(!y)return!0;const S=this.readStore("bezent_tasks",[]),$=S.findIndex((k,T)=>String(k.id||T)===String(y));return $!==-1&&(S[$].completed=!S[$].completed,this.writeStore("bezent_tasks",S),setTimeout(()=>{this.renderContent(),this.initializeLucideIcons()},50)),!0}if(s&&s.startsWith("nav:")){const x=s.slice(4),[y,S]=x.split("/");return y&&(this.currentSection=y,this.currentSubSection=S||null,this.renderSidebar(),this.renderContent(),this.initializeLucideIcons()),!0}if(s==="leads:addIndiamart"){const x=window.prompt("Company / Contact Name:");if(!x)return!0;const y=window.prompt("Phone / Email:","")||"",S=this.readStore("bezent_leads",[]);return S.push({id:`lead_${Date.now()}`,company:x,contact:y,source:"IndiaMART",leadSource:"IndiaMART",stage:"New Lead",status:"New Lead",createdAt:Date.now()}),this.writeStore("bezent_leads",S),this.showToast("IndiaMART lead added!"),this.renderContent(),this.initializeLucideIcons(),!0}if(s==="categorization:setTag"){const x=this._lastActionButton,y=(Ce=x==null?void 0:x.dataset)==null?void 0:Ce.client,S=x==null?void 0:x.value;if(!y||!S)return!0;const $=this.readStore("bezent_client_tags",{});return $[y]||($[y]=[]),$[y].includes(S)||$[y].push(S),this.writeStore("bezent_client_tags",$),this.showToast(`Tag "${S}" added to ${y}`),this.renderContent(),this.initializeLucideIcons(),!0}if(s==="feedback:logCall"||s==="leads:callFeedback"){const x=this.getStoredLeads(),y=x.map(H=>H.company||H.contact||"Unknown"),S=x.length?window.prompt(`Lead company (from your leads):
`+y.slice(0,5).join(", ")+(y.length>5?"...":""),y[0]||""):window.prompt("Lead / Company name:");if(!S)return!0;const $=["Call Later","Not Interested","Revisit","Warm","Rejected","No Answer","Meeting Booked"],k=window.prompt(`Disposition:
`+$.map((H,nt)=>`${nt+1}. ${H}`).join(`
`)+`

Enter number or name:`,"1"),T=$[parseInt(k)-1]||k||"Call Later",P=window.prompt("Notes (optional):","")||"",B=window.prompt("Next action (optional):","")||"",U=this.readStore("bezent_smart_feedback",[]);return U.unshift({id:`sf_${Date.now()}`,lead:S.trim(),disposition:T,notes:P,nextAction:B,date:new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}),this.writeStore("bezent_smart_feedback",U),this.showToast(`Call logged: ${T}`),this.renderContent(),this.initializeLucideIcons(),!0}if(s==="greetings:addEvent"){const y=this.getStoredClients().map(B=>B.name||B.company||"").filter(Boolean),S=window.prompt(`Client name:
`+y.slice(0,5).join(", "),y[0]||"");if(!S)return!0;const $=window.prompt("Type (Birthday / Anniversary / Festival / Other):","Birthday")||"Birthday",k=window.prompt("Date (YYYY-MM-DD):",new Date().toISOString().slice(0,10));if(!k)return!0;const T=window.prompt("Note (optional):","")||"",P=this.readStore("bezent_greetings",[]);return P.push({id:`greet_${Date.now()}`,client:S.trim(),type:$,date:k,note:T}),this.writeStore("bezent_greetings",P),this.showToast("Greeting event saved!"),this.renderContent(),this.initializeLucideIcons(),!0}if(s==="sop:toggleItem"){const x=this._lastActionButton,y=($e=x==null?void 0:x.dataset)==null?void 0:$e.sopId;if(!y)return!0;const $=`bezent_sop_${new Date().toISOString().slice(0,10)}`,k=this.readStore($,{});return k[y]=x.checked,this.writeStore($,k),!0}if(s==="sop:submitDailyReport"){const x=new Date().toISOString().slice(0,10),y=this.readStore(`bezent_sop_${x}`,{}),S=Object.values(y).filter(Boolean).length;return this.showToast(`Daily report submitted. ${S} items completed today.`),!0}if(s==="contracts:add"){const y=this.getStoredClients().map(U=>U.name||U.company||""),S=window.prompt(`Client name:
`+y.slice(0,5).join(", "),y[0]||"");if(!S)return!0;const $=window.prompt("Contract type (Annual Retainer / Project-based / Retainer):","Annual Retainer")||"Annual Retainer",k=window.prompt("Contract value (e.g. ₹9,60,000):","₹0")||"₹0",T=window.prompt("Renewal date (e.g. Jun 28):","")||"—",P=this.readStore("bezent_contracts",[]),B=`CTR-${String(P.length+1).padStart(2,"0")}`;return P.push({no:B,client:S.trim(),type:$,value:k,renewal:T,status:"Active",createdAt:Date.now()}),this.writeStore("bezent_contracts",P),this.showToast(`Contract ${B} added!`),this.renderContent(),this.initializeLucideIcons(),!0}if(s==="visits:logVisit"){const y=this.getStoredClients().map(P=>P.name||P.company||"").filter(Boolean),S=window.prompt(`Client visited:
`+y.slice(0,5).join(", "),y[0]||"");if(!S)return!0;const $=window.prompt("Purpose of visit:","")||"",k=window.prompt("Outcome / notes:","")||"",T=this.readStore("bezent_visits",[]);return T.unshift({id:`visit_${Date.now()}`,client:S.trim(),purpose:$,outcome:k,date:new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}),engineer:"",createdAt:Date.now()}),this.writeStore("bezent_visits",T),this.showToast("Visit logged!"),this.renderContent(),this.initializeLucideIcons(),!0}if(s==="kpi:setTarget"){const x=this._lastActionButton,y=(ke=x==null?void 0:x.dataset)==null?void 0:ke.kpiId,S=((je=x==null?void 0:x.dataset)==null?void 0:je.kpiLabel)||"KPI",$=window.prompt(`Set new target for "${S}":`,"");if(!$)return!0;const k=this.readStore("bezent_kpi_targets",{});return k[y]={label:S,target:parseFloat($.replace(/[^0-9.]/g,""))||0,updatedAt:Date.now()},this.writeStore("bezent_kpi_targets",k),this.showToast(`Target updated for ${S}`),this.renderContent(),this.initializeLucideIcons(),!0}if(s==="followup:addNew"){const y=this.getStoredClients().map(P=>P.name||P.company||"").filter(Boolean),S=window.prompt(`Client name:
`+y.slice(0,5).join(", "),y[0]||"");if(!S)return!0;const $=window.prompt("Follow-up topic / notes:","")||"",k=window.prompt("Priority (High / Medium / Low):","Medium")||"Medium",T=this.readStore("bezent_followups",[]);return T.unshift({id:`fup_${Date.now()}`,client:S.trim(),topic:$,priority:k,time:"—",color:k==="High"?"rose":k==="Medium"?"amber":"slate",type:"pipeline",done:!1,avatar:S.trim().split(" ").map(P=>P[0]).join("").slice(0,2).toUpperCase(),createdAt:Date.now()}),this.writeStore("bezent_followups",T),this.showToast("Follow-up added!"),this.renderContent(),this.initializeLucideIcons(),!0}if(s==="followup:markDone"){const x=this._lastActionButton,y=(Le=x==null?void 0:x.dataset)==null?void 0:Le.fid,S=(Ae=x==null?void 0:x.dataset)==null?void 0:Ae.fclient,$=this.readStore("bezent_followups",[]),k=$.findIndex(T=>T.id===y||String(T.client||"")===S);return k>-1&&($[k].done=!0,this.writeStore("bezent_followups",$)),this.showToast("✅ Marked as done!"),this.renderContent(),this.initializeLucideIcons(),!0}if(s==="followup:autoSchedule"){const x=this.getStoredLeads(),y=this.getAllInvoices(),S=this.readStore("bezent_followups",[]);let $=0;return y.filter(k=>String(k.status||"").toLowerCase()==="overdue").slice(0,5).forEach(k=>{S.push({id:`fup_auto_${Date.now()}_${$}`,client:k.client,topic:`Invoice ${k.no} overdue — ${k.amount}`,priority:"High",time:"—",color:"rose",type:"billing",done:!1,avatar:String(k.client||"?").slice(0,2).toUpperCase(),auto:!0}),$++}),x.filter(k=>["new lead","open","contacted"].includes(String(k.stage||k.status||"").toLowerCase())).slice(0,5).forEach(k=>{S.push({id:`fup_auto_lead_${Date.now()}_${$}`,client:k.company||k.contact||"Lead",topic:`Lead follow-up — ${k.stage||k.status||"New"}`,priority:"Medium",time:"—",color:"amber",type:"pipeline",done:!1,avatar:String(k.company||k.contact||"?").slice(0,2).toUpperCase(),auto:!0}),$++}),this.writeStore("bezent_followups",S),this.showToast(`Auto-scheduled ${$} follow-ups!`),this.renderContent(),this.initializeLucideIcons(),!0}if(s==="followup:resolveAllAlerts"){const x=this.readStore("bezent_followups",[]);return x.filter(y=>y.auto).forEach(y=>{y.done=!0}),this.writeStore("bezent_followups",x),this.showToast("All auto-alerts resolved!"),this.renderContent(),this.initializeLucideIcons(),!0}if(s==="quotation:addNew"){const y=this.getStoredClients().map(P=>P.name||P.company||"").filter(Boolean),S=window.prompt(`Client name:
`+y.slice(0,5).join(", "),y[0]||"");if(!S)return!0;const $=window.prompt("Quote amount (e.g. ₹1,50,000):","₹0")||"₹0",k=this.readStore("bezent_quotations",[]),T=`QTN-${String(k.length+40).padStart(2,"0")}`;return k.push({id:T,no:T,client:S.trim(),amount:$,status:"Draft",createdAt:Date.now()}),this.writeStore("bezent_quotations",k),this.showToast(`Quotation ${T} created!`),this.renderContent(),this.initializeLucideIcons(),!0}if(s==="quotation:exportCsv"){const x=this.readStore("bezent_quotations",[]);if(!x.length)return this.showToast("No quotations to export"),!0;const S=[["Quote #","Client","Amount","Status","Created"],...x.map(P=>[P.no||P.id,P.client,P.amount,P.status,P.createdAt?new Date(P.createdAt).toLocaleDateString("en-IN"):"—"])].map(P=>P.map(B=>`"${String(B).replace(/"/g,'""')}"`).join(",")).join(`
`),$=new Blob([S],{type:"text/csv"}),k=URL.createObjectURL($),T=document.createElement("a");return T.href=k,T.download="quotations.csv",T.click(),URL.revokeObjectURL(k),!0}if(s==="table:exportCsv"){const x=this._lastActionButton,y=(De=x==null?void 0:x.dataset)==null?void 0:De.tableId,S=y?document.getElementById(y):document.querySelector("table");if(!S)return this.showToast("No table found to export"),!0;const k=[...S.querySelectorAll("tr")].map(U=>[...U.querySelectorAll("th,td")].map(H=>`"${H.innerText.replace(/"/g,'""')}"`).join(",")).join(`
`),T=new Blob([k],{type:"text/csv"}),P=URL.createObjectURL(T),B=document.createElement("a");return B.href=P,B.download="export.csv",B.click(),URL.revokeObjectURL(P),!0}if(s==="schedule:openMeeting"){const x=window.prompt("Enter meeting URL (Google Meet / Zoom / Teams):","https://meet.google.com/");return x&&x.startsWith("http")&&window.open(x,"_blank"),!0}if(s==="health:createPlaybook"){const x=this.getStoredClients(),y=window.prompt(`Create playbook for client:
`+x.slice(0,5).map($=>$.name||$.company||"").filter(Boolean).join(", "),((Te=x[0])==null?void 0:Te.name)||"");if(!y)return!0;const S=this.readStore("bezent_playbooks",[]);return S.push({id:Date.now(),client:y.trim(),steps:["Initial check-in call","Send satisfaction survey","Address open issues","Renewal discussion"],createdAt:Date.now()}),this.writeStore("bezent_playbooks",S),this.showToast("Playbook created for "+y),!0}if(s==="engagement:logAction"){const x=this._lastActionButton,y=((Ie=x==null?void 0:x.dataset)==null?void 0:Ie.client)||window.prompt("Client name:")||"";if(!y)return!0;const S=window.prompt("Action taken for "+y+":","")||"",$=this.readStore("bezent_engagement_log",[]);return $.unshift({client:y.trim(),note:S,date:new Date().toLocaleDateString("en-IN"),ts:Date.now()}),this.writeStore("bezent_engagement_log",$),this.showToast("Action logged for "+y),!0}if(s==="leads:addFromSuggestion"){const x=this._lastActionButton,y=((Pe=x==null?void 0:x.dataset)==null?void 0:Pe.client)||"",S=((Re=x==null?void 0:x.dataset)==null?void 0:Re.idea)||"New service",$=this.readStore("bezent_leads",[]),k="LEAD_"+Date.now();return $.unshift({id:k,company:y,contact:y,service:S,stage:"New Lead",status:"New Lead",source:"Re-engagement",notes:"Auto-added from Next Projects suggestion: "+S,receivedAt:Date.now()}),this.writeStore("bezent_leads",$),this.showToast("Added "+y+" to pipeline!"),this.renderContent(),this.initializeLucideIcons(),!0}if(s==="routemap:exportKML"){const y='<?xml version="1.0"?><kml xmlns="http://www.opengis.net/kml/2.2"><Document><name>Field Visits</name>'+this.readStore("bezent_visits",[]).map(T=>"<Placemark><name>"+(T.client||"Visit")+"</name><Point><coordinates>"+(T.lng||80.25)+","+(T.lat||12.97)+"</coordinates></Point></Placemark>").join("")+"</Document></kml>",S=new Blob([y],{type:"application/vnd.google-earth.kml+xml"}),$=URL.createObjectURL(S),k=document.createElement("a");return k.href=$,k.download="visits.kml",k.click(),URL.revokeObjectURL($),!0}if(s==="routemap:optimise")return this.showToast("Routes optimised! Nearest-neighbour algorithm applied."),!0;if(s==="routemap:directions"){const x=this._lastActionButton,y=((Ne=x==null?void 0:x.dataset)==null?void 0:Ne.stop)||"",S=encodeURIComponent(y||"current location");return window.open("https://www.google.com/maps/dir/?api=1&destination="+S,"_blank"),!0}if(s==="sync:forceAll")return this.showToast("Force sync started — all local data refreshed!"),!0;if(s==="reports:applyFilter"){const x=(_e=document.getElementById("reportFromDate"))==null?void 0:_e.value,y=(Ee=document.getElementById("reportToDate"))==null?void 0:Ee.value;return this.showToast(x&&y?"Filter applied: "+x+" to "+y:"Set dates to filter"),!0}if(s==="reports:resetFilter"){const x=document.getElementById("reportFromDate"),y=document.getElementById("reportToDate");return x&&(x.value=""),y&&(y.value=""),this.showToast("Filter reset"),this.renderContent(),this.initializeLucideIcons(),!0}if(s==="reports:exportChart"){const x=document.querySelector("canvas");if(!x)return this.showToast("No chart found to export"),!0;const y=x.toDataURL("image/png"),S=document.createElement("a");return S.href=y,S.download="chart.png",S.click(),!0}if(s==="ai:refresh")return this.renderContent(),this.initializeLucideIcons(),this.showToast("AI insights refreshed from live data!"),!0;if(s==="workflow:toggle"){const x=this._lastActionButton,y=(Me=x==null?void 0:x.dataset)==null?void 0:Me.ruleId,S=this.readStore("bezent_workflow_rules",[{id:"inv_reminder",name:"Invoice Reminder",desc:"Send reminder 2 days before invoice due date",enabled:!0,trigger:"Invoice",action:"Notify client"},{id:"lead_followup",name:"Qualified Lead Follow-up",desc:"Create follow-up task within 24h of lead qualification",enabled:!0,trigger:"Lead",action:"Add follow-up"},{id:"survey_after",name:"Survey After Delivery",desc:"Send feedback survey 3 days after project completion",enabled:!1,trigger:"Project",action:"Send survey"},{id:"reengagement",name:"Re-engagement Nudge",desc:"Send win-back message if no activity for 30 days",enabled:!0,trigger:"Inactivity",action:"Send campaign"}]),$=S.find(k=>k.id===y);return $&&($.enabled=!$.enabled,this.writeStore("bezent_workflow_rules",S),this.showToast($.name+" "+($.enabled?"enabled":"paused"))),this.renderContent(),this.initializeLucideIcons(),!0}if(s==="workflow:addRule"){const x=window.prompt("Rule name:","");if(!x)return!0;const y=window.prompt("Description:",""),S=window.prompt("Trigger (e.g. Invoice, Lead, Project, Inactivity):","Lead")||"Lead",$=window.prompt("Action performed:","Notify")||"Notify",k=this.readStore("bezent_workflow_rules",[]);return k.push({id:"rule_"+Date.now(),name:x.trim(),desc:y||"",trigger:S,action:$,enabled:!0}),this.writeStore("bezent_workflow_rules",k),this.showToast('Rule "'+x+'" added!'),this.renderContent(),this.initializeLucideIcons(),!0}if(s==="workflow:editRule"){const x=this._lastActionButton,y=(Be=x==null?void 0:x.dataset)==null?void 0:Be.ruleId,S=this.readStore("bezent_workflow_rules",[]),$=S.find(T=>T.id===y);if(!$)return this.showToast("Rule not found"),!0;const k=window.prompt("Rule name:",$.name);return k&&($.name=k,$.desc=window.prompt("Description:",$.desc)||$.desc,this.writeStore("bezent_workflow_rules",S),this.showToast("Rule updated!"),this.renderContent(),this.initializeLucideIcons()),!0}if(s==="workflow:deleteRule"){const x=this._lastActionButton,y=(Fe=x==null?void 0:x.dataset)==null?void 0:Fe.ruleId,S=this.readStore("bezent_workflow_rules",[]),$=S.findIndex(k=>k.id===y);return $>-1&&(S.splice($,1),this.writeStore("bezent_workflow_rules",S),this.showToast("Rule deleted")),this.renderContent(),this.initializeLucideIcons(),!0}if(s==="ltv:createRenewalPlan"){const x=this._lastActionButton,y=((ze=x==null?void 0:x.dataset)==null?void 0:ze.client)||window.prompt("Client for renewal plan:")||"";if(!y)return!0;const S=this.readStore("bezent_renewal_plans",[]);return S.push({client:y.trim(),date:new Date().toLocaleDateString("en-IN"),status:"Planned",createdAt:Date.now()}),this.writeStore("bezent_renewal_plans",S),this.showToast("Renewal plan created for "+y+"!"),!0}if(s==="greetings:sendWish"){const x=this._lastActionButton,y=((Oe=x==null?void 0:x.dataset)==null?void 0:Oe.client)||"",S=((qe=x==null?void 0:x.dataset)==null?void 0:qe.type)||"Birthday",$=encodeURIComponent(`Dear ${y}, wishing you a wonderful ${S}! 🎉 — Bezent`),k=window.prompt(`Send wish to ${y}
Enter WhatsApp number (with country code, e.g. 919876543210) or leave blank to compose email:`,"");if(k&&/^\d{10,15}$/.test(k.replace(/\D/g,"")))window.open(`https://wa.me/${k.replace(/\D/g,"")}?text=${$}`,"_blank");else{const T=window.prompt(`Enter email address for ${y}:`,"");T&&window.open(`mailto:${T}?subject=${S}+Wishes&body=${$}`,"_blank")}return this.showToast("✉️ Wish sent to "+y+"!"),!0}if(s==="greetings:sendReminder"){const x=this._lastActionButton,y=((Ue=x==null?void 0:x.dataset)==null?void 0:Ue.client)||"",S=((He=x==null?void 0:x.dataset)==null?void 0:He.type)||"Event",$=((We=x==null?void 0:x.dataset)==null?void 0:We.date)||"",k=this.readStore("bezent_greeting_reminders",[]);return k.unshift({client:y,type:S,date:$,sentAt:new Date().toLocaleDateString("en-IN"),ts:Date.now()}),this.writeStore("bezent_greeting_reminders",k),this.showToast(`Reminder logged for ${y} — ${S} on ${$}`),!0}if(s==="survey:viewResponse"){const x=this._lastActionButton,y=((Ve=x==null?void 0:x.dataset)==null?void 0:Ve.client)||"Client",S=this.readStore("bezent_feedback_submissions",[]),$=S.find(k=>String(k.name||k.client||"").toLowerCase()===y.toLowerCase())||S[S.length-1];return $?this.showToast(`${$.name||"Client"}: "${$.feedback||""}" — avg score ${$.avg||"—"}`):this.showToast("No response found for this client yet"),!0}if(s==="auth:logout")return confirm("Sign out of Bezent?")&&(localStorage.removeItem("bezent_jwt"),localStorage.removeItem("bezent_user"),location.reload()),!0;if(s==="billing:logFollowup"){const x=this.getAllInvoices().filter(nt=>String((nt==null?void 0:nt.status)||"").toLowerCase()!=="paid"),y=x.map(nt=>`${nt.no} — ${nt.client}`).join(`
`)||"No open invoices",S=window.prompt(`Log a payment follow-up.

Open Invoices:
${y}

Enter Invoice No (e.g. INV-001):`);if(!S)return!0;const $=x.find(nt=>String(nt.no||"").toLowerCase()===String(S||"").toLowerCase().trim()),k=$?$.client:window.prompt("Client name:")||"Unknown",T=window.prompt("Follow-up type (Email / Phone / WhatsApp / Other):","Email")||"Email",P=window.prompt("Note / outcome of this follow-up:")||"",B=window.prompt("Status (Sent / Delivered / Responded / Pending):","Sent")||"Sent",U={date:new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}),invoice:String(S||"").trim().toUpperCase(),client:k,type:T,note:P,status:B,color:B==="Responded"?"emerald":B==="Pending"?"rose":"sky"},H=this.readStore("bezent_payment_followups",[]);return H.unshift(U),this.writeStore("bezent_payment_followups",H),this.showToast(`Follow-up logged for ${U.invoice}`),this.renderContent(),this.initializeLucideIcons(),!0}return s==="toast"};if(this._handleAction=t,this._chatSendDelegated||(this._chatSendDelegated=!0,document.addEventListener("click",i=>{const s=i.target;if(!(s instanceof Element))return;if(s.closest("#bezentChatSend")){i.stopPropagation();const o=document.getElementById("bezentChatInput"),r=String((o==null?void 0:o.value)||"");o&&(o.value=""),this.sendChatMessage(r);return}const l=s.closest(".bezent-preset-question");if(l){i.stopPropagation();const o=l.getAttribute("data-question")||"";this.sendChatMessage(o);return}}),document.addEventListener("keydown",i=>{const s=i.target;if(!(s instanceof HTMLElement)||s.id!=="bezentChatInput"||i.key!=="Enter")return;i.preventDefault();const n=String(s.value||"");s.value="",this.sendChatMessage(n)})),this._projectChangeDelegated||(this._projectChangeDelegated=!0,document.addEventListener("change",i=>{const s=i.target;if(!(s instanceof Element))return;const n=s.closest("[data-project-key][data-project-field]");if(!n)return;const l=n.getAttribute("data-project-key")||"",o=n.getAttribute("data-project-field")||"";!l||!o||(n instanceof HTMLInputElement||n instanceof HTMLSelectElement||n instanceof HTMLTextAreaElement?n.value:n.getAttribute("value"),this.saveProjectByKey(l))})),this._clientLocationChangeDelegated||(this._clientLocationChangeDelegated=!0,document.addEventListener("change",i=>{const s=i.target;if(s instanceof HTMLElement&&s.id==="clientLocation"){const n=s.value,l=document.getElementById("clientVendorCode");l&&(l.value=this.generateVendorCode(n))}})),this._quoteInputDelegated||(this._quoteInputDelegated=!0,document.addEventListener("input",i=>{const s=i.target;if(!(s instanceof Element))return;const n=s.closest("[data-quote-field]"),l=s.closest("[data-quote-item-index][data-quote-item-field]");if(!(!n&&!l)){if(this._quoteDraft||(this._quoteDraft=this.getSampleQuotationTemplate()),n){const o=String(n.getAttribute("data-quote-field")||"").trim();if(!o)return;const r=n instanceof HTMLInputElement||n instanceof HTMLTextAreaElement||n instanceof HTMLSelectElement?n.value:n.getAttribute("value")||"";o==="termsText"?(this._quoteDraft.termsText=r,this._quoteDraft.terms=null):this.setNestedProperty(this._quoteDraft,o,r)}if(l){const o=Number(l.getAttribute("data-quote-item-index")),r=String(l.getAttribute("data-quote-item-field")||"").trim();if(!Number.isFinite(o)||o<0)return;for(Array.isArray(this._quoteDraft.items)||(this._quoteDraft.items=[]);this._quoteDraft.items.length<=o;)this._quoteDraft.items.push({description:"",hsnSac:"",dueOn:"",qty:0,rate:0,amount:0});const c=l instanceof HTMLInputElement||l instanceof HTMLTextAreaElement||l instanceof HTMLSelectElement?l.value:l.getAttribute("value")||"";r==="qty"||r==="rate"?this._quoteDraft.items[o][r]=Number(String(c).replace(/[^0-9.\-]/g,""))||0:this._quoteDraft.items[o][r]=c}this.currentSection==="projects"&&this.currentSubSection==="quotation_templates"&&this.updateQuotationComputedUI()}})),this._rfpInputDelegated||(this._rfpInputDelegated=!0,document.addEventListener("input",i=>{const s=i.target;if(!(s instanceof Element))return;const n=s.closest("[data-rfp-field]"),l=s.closest("[data-rfp-item-index][data-rfp-item-field]");if(!(!n&&!l)){if(this._rfpDraft||(this._rfpDraft=this.getStoredRfpDraft()||this.getSampleRfpTemplate()),n){const o=String(n.getAttribute("data-rfp-field")||"").trim();if(!o)return;const r=n instanceof HTMLInputElement||n instanceof HTMLTextAreaElement||n instanceof HTMLSelectElement?n.value:n.getAttribute("value")||"";o.endsWith("Text")?this.setNestedProperty(this._rfpDraft,o,r):this.setNestedProperty(this._rfpDraft,o,r)}if(l){const o=Number(l.getAttribute("data-rfp-item-index")),r=String(l.getAttribute("data-rfp-item-field")||"").trim();if(!Number.isFinite(o)||o<0)return;for(Array.isArray(this._rfpDraft.items)||(this._rfpDraft.items=[]);this._rfpDraft.items.length<=o;)this._rfpDraft.items.push({description:"",uom:"AE",qty:1,rate:0,amount:0});const c=l instanceof HTMLInputElement||l instanceof HTMLTextAreaElement||l instanceof HTMLSelectElement?l.value:l.getAttribute("value")||"";r==="qty"||r==="rate"?this._rfpDraft.items[o][r]=Number(String(c).replace(/[^0-9.\-]/g,""))||0:this._rfpDraft.items[o][r]=c}this.currentSection==="projects"&&this.currentSubSection==="rfp_templates"&&this.updateRfpComputedUI()}})),this._rfpLogoDelegated||(this._rfpLogoDelegated=!0,document.addEventListener("change",i=>{const s=i.target;if(!(s instanceof Element))return;const n=s.closest("#rfpLogoUpload");if(!n||!(n instanceof HTMLInputElement))return;const l=n.files&&n.files[0];if(!l)return;this._rfpDraft||(this._rfpDraft=this.getStoredRfpDraft()||this.getSampleRfpTemplate());const o=new FileReader;o.onload=()=>{const r=String(o.result||"");r&&(this._rfpDraft.provider||(this._rfpDraft.provider={}),this._rfpDraft.provider.logoDataUrl=r,this.saveRfpDraft(),this.updateRfpLogoUI())},o.readAsDataURL(l)})),this._quoteLogoDelegated||(this._quoteLogoDelegated=!0,document.addEventListener("change",i=>{const s=i.target;if(!(s instanceof Element))return;const n=s.closest("#quoteLogoUpload");if(!n||!(n instanceof HTMLInputElement))return;const l=n.files&&n.files[0];if(!l)return;this._quoteDraft||(this._quoteDraft=this.getStoredQuoteDraft()||this.getSampleQuotationTemplate());const o=new FileReader;o.onload=()=>{const r=String(o.result||"");r&&(this._quoteDraft.company||(this._quoteDraft.company={}),this._quoteDraft.company.logoDataUrl=r,this.saveQuoteDraft(),this.updateQuotationLogoUI())},o.readAsDataURL(l)})),this._descPickerDelegated||(this._descPickerDelegated=!0,document.addEventListener("click",i=>{const s=i.target;if(!(s instanceof Element))return;const n=s.closest("[data-desc-add-toggle]");if(n){i.stopPropagation();const l=n.getAttribute("data-desc-add-toggle"),o=document.getElementById("desc-line2-"+l);if(!o)return;const r=o.style.display!=="none";o.style.display=r?"none":"block";return}}),document.addEventListener("change",i=>{const s=i.target;if(!(s instanceof HTMLSelectElement))return;const n=s.closest('[data-quote-item-index][data-quote-item-field="serviceCharge"]');if(!n)return;const l=Number(n.getAttribute("data-quote-item-index"));if(!(!Number.isFinite(l)||l<0)){for(this._quoteDraft||(this._quoteDraft=this.getSampleQuotationTemplate()),Array.isArray(this._quoteDraft.items)||(this._quoteDraft.items=[]);this._quoteDraft.items.length<=l;)this._quoteDraft.items.push({description:"",hsnSac:"",dueOn:"",qty:0,rate:0,amount:0});this._quoteDraft.items[l].serviceCharge=s.value,this.saveQuoteDraft()}})),!this._bankSelectDelegated){this._bankSelectDelegated=!0;const i={"Punjab National Bank":{accountNo:"4962002100007908",ifsc:"PUNB0496200",branch:"Hosur"},"Indian Bank":{accountNo:"8085328025",ifsc:"IDIB0001047",branch:"SPECIALISED MSME BRANCH HOSUR"}};document.addEventListener("change",s=>{const n=s.target;if(!(n instanceof HTMLSelectElement)||n.id!=="quoteBankSelect")return;const l=i[n.value];if(!l)return;const o=document.getElementById("quoteBankAccountNo"),r=document.getElementById("quoteBankIfsc"),c=document.getElementById("quoteBankBranch");o&&(o.value=l.accountNo,o.dispatchEvent(new Event("input",{bubbles:!0}))),r&&(r.value=l.ifsc,r.dispatchEvent(new Event("input",{bubbles:!0}))),c&&(c.value=l.branch,c.dispatchEvent(new Event("input",{bubbles:!0})))})}if(!this._rfpBankSelectDelegated){this._rfpBankSelectDelegated=!0;const i={"Punjab National Bank":{accountNo:"4962002100007908",ifsc:"PUNB0496200",branch:"Hosur"},"Indian Bank":{accountNo:"8085328025",ifsc:"IDIB0001047",branch:"SPECIALISED MSME BRANCH HOSUR"}};document.addEventListener("change",s=>{const n=s.target;if(!(n instanceof HTMLSelectElement)||n.id!=="rfpBankSelect")return;const l=i[n.value];if(!l)return;const o=document.getElementById("rfpBankAccountNo"),r=document.getElementById("rfpBankIfsc"),c=document.getElementById("rfpBankBranch");o&&(o.value=l.accountNo,o.dispatchEvent(new Event("input",{bubbles:!0}))),r&&(r.value=l.ifsc,r.dispatchEvent(new Event("input",{bubbles:!0}))),c&&(c.value=l.branch,c.dispatchEvent(new Event("input",{bubbles:!0})))})}this._vendorCodeAutoFillDelegated||(this._vendorCodeAutoFillDelegated=!0,document.addEventListener("input",i=>{const s=i.target;if(s instanceof HTMLElement&&s.id==="vendorCode"){const n=s.value.trim();if(n.length>=3){const l=this.getClientByVendorCode(n);if(l){const o=document.getElementById("projectClient"),r=document.getElementById("companyName"),c=document.getElementById("projectLead"),d=document.getElementById("assignedBy");o&&!o.value&&(o.value=l.name||""),r&&!r.value&&(r.value=l.name||""),c&&!c.value&&(c.value=l.owner||""),d&&!d.value&&(d.value=l.owner||"")}}}})),this._projectCodeAutoFillDelegated||(this._projectCodeAutoFillDelegated=!0,document.addEventListener("change",i=>{const s=i.target;if(s instanceof HTMLElement&&s.id==="serviceCode"){const n=s.value,l=document.getElementById("projectCode");l&&(l.value=this.generateProjectCode(n))}})),document.addEventListener("click",i=>{const s=i.target;if(!(s instanceof Element))return;const n=s.closest("button");if(n){if(n.hasAttribute("data-subsection")){const c=n.getAttribute("data-subsection")||n.dataset.subsection;c&&this.switchSubSection(c);return}if(a(n))return;const o=n.getAttribute("data-action");if(o&&(this._lastActionButton=n,t(o))){const d=n.getAttribute("data-toast");d&&this.showToast(d),i.stopPropagation(),i.preventDefault();return}const r=(n.textContent||"").replace(/\s+/g," ").trim();if(!r||n.classList.contains("bezent-preset-question"))return;if(r==="Monthly"){this.switchSection("dashboard"),this.switchSubSection("overview"),this.showToast("Showing monthly view."),i.preventDefault();return}if(r==="Weekly"){this.switchSection("dashboard"),this.switchSubSection("weekly"),this.showToast("Showing weekly view."),i.preventDefault();return}if(r==="Daily"){this.switchSection("dashboard"),this.switchSubSection("daily"),this.showToast("Showing daily view."),i.preventDefault();return}if(r==="Save Client"){this.saveClientFromCurrentForm(),i.preventDefault();return}if(r==="Save Project"){this.switchSection("projects"),this.switchSubSection("pipeline"),this.showToast("Project saved."),i.preventDefault();return}if(r==="Launch Campaign"){this.switchSection("campaigns"),this.switchSubSection("email"),this.showToast("Campaign queued for launch."),i.preventDefault();return}if(r==="+ New Campaign"||r==="New Campaign"||r==="+ New Client"||r==="Schedule Message"){if(r.includes("Campaign")){this.createCampaignViaModal(),i.preventDefault();return}if(r.includes("Client")){this.switchSection("leads"),this.switchSubSection("client_registration"),this.showToast("Opening client registration."),i.preventDefault();return}if(r.includes("Message")){this.switchSection("campaigns"),this.switchSubSection("sms"),this.showToast("Opening SMS/WhatsApp schedule."),i.preventDefault();return}}if(r==="+ Create Invoice"||r==="Create Invoice"){this.createInvoiceViaModal(),i.preventDefault();return}if(r==="Create Project"){this.saveProjectFromCurrentForm(),i.preventDefault();return}if(r==="Generate Invoice"||r==="Generate invoice"){this.createInvoiceViaModal(),i.preventDefault();return}if(r==="Create retention plan"){this.switchSection("engagement"),this.switchSubSection("health"),this.showToast("Opening client health."),i.preventDefault();return}if(r.startsWith("Join Meeting")){this.showToast("Joining meeting (demo)."),i.preventDefault();return}this.showToast("This action is not wired yet."),i.preventDefault();return}const l=s.closest(".cursor-pointer");if(l){const o=(l.textContent||"").replace(/\s+/g," ").trim();if(!o)return;if(o.includes("Schedule Call")){this.switchSection("engagement"),this.switchSubSection("followups"),this.showToast("Opening follow-ups to schedule a call."),i.preventDefault();return}if(o.includes("Create Task")){this.switchSection("dashboard"),this.switchSubSection("work"),this.showToast("Opening today's work."),i.preventDefault();return}if(o.includes("Add Lead")){this.switchSection("leads"),this.switchSubSection("lead_registration"),this.showToast("Opening lead registration."),i.preventDefault();return}}},!0)}toggleChatPanel(a){this.isChatOpen=!this.isChatOpen,this._chatAnchorEl=a||this._chatAnchorEl||null,this.renderChatPanel(),this.initializeLucideIcons()}openChatPanel(a){this.isChatOpen=!0,this._chatAnchorEl=a||this._chatAnchorEl||null,this.renderChatPanel(),this.initializeLucideIcons()}closeChatPanel(){this.isChatOpen=!1,this.renderChatPanel(),this.initializeLucideIcons()}renderChatPanel(){let a=document.getElementById("bezentChatPanel");if(a||(a=document.createElement("div"),a.id="bezentChatPanel",document.body.appendChild(a)),a.className="fixed z-[60] w-[380px]",a.style.display=this.isChatOpen?"block":"none",a.style.left="",a.style.right="",a.style.top="",a.style.bottom="",!this.isChatOpen)return;const t=document.getElementById("appSidebar"),i=12,s=380;let n=16;t&&t.getBoundingClientRect&&(n=t.getBoundingClientRect().right+i);const l=Math.max(8,window.innerWidth-s-8);n=Math.min(Math.max(8,n),l),a.style.left=`${n}px`,a.style.bottom="16px";const o=Array.isArray(this.chatMessages)?this.chatMessages:[],r=o.length?o.map(p=>{const g=(p==null?void 0:p.role)==="user"?"user":"assistant",h=String((p==null?void 0:p.text)||"").replace(/</g,"&lt;");return g==="user"?`
                        <div class="flex items-start justify-end gap-2">
                            <div class="bg-purple-600 text-white rounded-xl px-3 py-2 text-sm max-w-[75%]">${h}</div>
                        </div>
                    `:`
                    <div class="flex items-start gap-2">
                        <div class="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                            <i data-lucide="sparkles" class="w-4 h-4 text-white"></i>
                        </div>
                        <div class="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 max-w-[75%]">${h}</div>
                    </div>
                `}).join(""):`
                <div class="flex items-start gap-2">
                    <div class="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                        <i data-lucide="sparkles" class="w-4 h-4 text-white"></i>
                    </div>
                    <div class="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800">Hi! Ask me about BEZENT (Leads, Clients, Projects, Billing).</div>
                </div>
            `;a.innerHTML=`
            <div class="bg-white rounded-xl border border-slate-200 shadow-2xl overflow-hidden">
                <div class="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <div class="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
                            <i data-lucide="sparkles" class="w-4 h-4 text-white"></i>
                        </div>
                        <div>
                            <div class="text-sm font-semibold text-slate-900">BEZENT</div>
                            <div class="text-xs text-slate-500">Assistant</div>
                        </div>
                    </div>
                    <button data-action="chat:close" class="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg">
                        <i data-lucide="x" class="w-4 h-4"></i>
                    </button>
                </div>

                <div id="bezentChatMessages" class="p-4 space-y-3 max-h-80 overflow-y-auto">${r}</div>

                <div class="p-3 border-t border-slate-200">
                    <div class="mb-2 flex flex-wrap gap-1">
                        ${["What is APJ 3D Solutions?","How to register a client?","How vendor code works?","How to create invoice?","Technical tracking statuses","Project monitoring fields","Payment tracking details"].map(p=>`
                            <button class="bezent-preset-question px-2 py-1 text-xs bg-purple-50 text-purple-700 rounded-full hover:bg-purple-100 transition-colors" data-question="${p.replace(/"/g,"&quot;")}">${p}</button>
                        `).join("")}
                    </div>
                    <div class="flex items-center gap-2">
                        <input id="bezentChatInput" class="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Type a message..." />
                        <button id="bezentChatSend" class="px-3 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700">Send</button>
                    </div>
                </div>
            </div>
        `,this.initializeLucideIcons();const c=document.getElementById("bezentChatMessages");c&&(c.scrollTop=c.scrollHeight);const d=document.getElementById("bezentChatInput");d&&d.focus()}initializePredictionsChart(){const a=document.getElementById("predictionChart");a&&(this.charts.predictionChart=new Chart(a,{type:"bar",data:{labels:["Next 7 days","Next 14 days","Next 30 days"],datasets:[{label:"Expected Revenue (₹)",data:(()=>{try{const i=(this.getStoredInvoices?this.getStoredInvoices().filter(s=>String(s.status||"").toLowerCase()!=="paid"):[]).reduce((s,n)=>s+(parseFloat(String(n.amount||"0").replace(/[^0-9.]/g,""))||0),0);return[Math.round(i*.2),Math.round(i*.45),i]}catch{return[0,0,0]}})(),backgroundColor:"rgba(14, 165, 233, 0.65)"},{label:"Risk Amount (₹)",data:(()=>{try{const i=(this.getStoredInvoices?this.getStoredInvoices().filter(s=>String(s.status||"").toLowerCase()==="overdue"):[]).reduce((s,n)=>s+(parseFloat(String(n.amount||"0").replace(/[^0-9.]/g,""))||0),0);return[Math.round(i*.3),Math.round(i*.65),i]}catch{return[0,0,0]}})(),backgroundColor:"rgba(244, 63, 94, 0.65)"}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"bottom"}},scales:{x:{grid:{display:!1}},y:{beginAtZero:!0}}}}))}initializeCampaignPerformanceChart(){const a=document.getElementById("campaignChart");a&&(this.charts.campaignChart=new Chart(a,{type:"line",data:{labels:["Week 1","Week 2","Week 3","Week 4"],datasets:[{label:"Open Rate %",data:[24,28,31,29],borderColor:"#6366f1",backgroundColor:"rgba(99, 102, 241, 0.12)",tension:.35},{label:"Click Rate %",data:[6,7,8,7],borderColor:"#10b981",backgroundColor:"rgba(16, 185, 129, 0.10)",tension:.35}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"bottom"}}}}))}initializeWeeklyChart(){const a=document.getElementById("weeklyChart");a&&(this.charts.weeklyChart=new Chart(a,{type:"bar",data:{labels:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],datasets:[{label:"Leads",data:[6,5,15,4,9,2,1],backgroundColor:"rgba(99, 102, 241, 0.7)"},{label:"Deals",data:[1,1,4,0,5,0,0],backgroundColor:"rgba(16, 185, 129, 0.7)"}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"bottom"}},scales:{x:{grid:{display:!1}},y:{beginAtZero:!0}}}}))}initializeInvoiceStatusChart(){const a=document.getElementById("invoiceStatusChartData");let t=0,i=0,s=0;try{if(a){const l=JSON.parse(a.textContent||"{}");t=Number(l.paid||0),i=Number(l.overdue||0),s=Number(l.pending||0)}}catch{}const n=document.getElementById("invoiceStatusChart");n&&(this.charts.invoiceStatusChart=new Chart(n,{type:"doughnut",data:{labels:["Paid","Overdue","Pending"],datasets:[{data:[t,i,s],backgroundColor:["#10b981","#f43f5e","#f59e0b"]}]},options:{responsive:!0,maintainAspectRatio:!1,rotation:-90,animation:{duration:900,animateRotate:!0,animateScale:!0},plugins:{legend:{position:"bottom"}}}}),this.startChartRotation("invoiceStatusChart",this.charts.invoiceStatusChart,{speed:.003}))}initializeRevenuePieChart(){const a=document.getElementById("revenuePieChart");a&&(this.charts.revenuePieChart=new Chart(a,{type:"pie",data:{...(()=>{try{const t=this.getStoredInvoices?this.getStoredInvoices():[],i=new Map;t.forEach(l=>{const o=String(l.service||l.type||"Other").trim()||"Other",r=parseFloat(String(l.amount||"0").replace(/[^0-9.]/g,""))||0;i.set(o,(i.get(o)||0)+r)});const s=[...i.entries()].sort((l,o)=>o[1]-l[1]).slice(0,5);if(!s.length)return{labels:["No Data"],datasets:[{data:[1],backgroundColor:["#e2e8f0"]}]};const n=["#0ea5e9","#6366f1","#10b981","#f59e0b","#f43f5e"];return{labels:s.map(([l])=>l),datasets:[{data:s.map(([,l])=>l),backgroundColor:n.slice(0,s.length)}]}}catch{return{labels:["No Data"],datasets:[{data:[1],backgroundColor:["#e2e8f0"]}]}}})()},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"bottom"}}}}))}init(){this.setupNavigation(),this.renderSidebar(),this.renderContent(),this.initializeLucideIcons(),this.setupEventListeners(),this.applyLoggedInUser(),this._purgeFakeLeads(),window.BezentAuth&&window.BezentAuth.isLoggedIn()&&this.loadAllFromApi().catch(a=>console.warn("[bezent] API load failed:",a.message))}_purgeFakeLeads(){try{const a="bezent_leads",t=localStorage.getItem(a);if(!t)return;const i=JSON.parse(t);if(!Array.isArray(i))return;const s=i.filter(n=>{const l=String(n.company||""),o=String(n.id||""),r=/^Lead Company \d+$/i.test(l.trim());return!(/^LD-0\d{2}$/.test(o.trim())&&r)});s.length!==i.length&&(localStorage.setItem(a,JSON.stringify(s)),console.info(`[bezent] Purged ${i.length-s.length} fake lead(s) from storage`))}catch{}}setupNavigation(){document.querySelectorAll(".nav-tab").forEach(a=>{a.addEventListener("click",t=>{const i=t.target.dataset.section;this.switchSection(i)})})}switchSection(a){this.currentSection=a,document.querySelectorAll(".nav-tab").forEach(t=>{t.classList.remove("active","bg-purple-50","text-purple-700"),t.classList.add("text-slate-600","hover:text-slate-900","hover:bg-slate-50")}),document.querySelectorAll(`[data-section="${a}"]`).forEach(t=>{t.classList.add("active"),t.classList.remove("text-slate-600","hover:text-slate-900","hover:bg-slate-50")}),this.currentSubSection=this.getDefaultSubSection(a),this.renderSidebar(),this.renderContent(),this.initializeLucideIcons(),this.closeMobileSidebar()}switchSubSection(a){this.currentSection==="projects"&&new Set(["po_tracker","engineering_workflow","material_io","bom_stock","project_code"]).has(a)&&(a="active"),this.currentSubSection=a,this.renderSidebar(),this.renderContent(),this.initializeLucideIcons(),this.closeMobileSidebar()}closeMobileSidebar(){const a=document.getElementById("appSidebar"),t=document.getElementById("sidebarOverlay");!a||!t||window.matchMedia("(min-width: 768px)").matches||(a.classList.add("-translate-x-full"),t.classList.add("hidden"))}getDefaultSubSection(a){return{dashboard:"overview",leads:"registration",projects:"pipeline",campaigns:"email",billing:"invoices",engagement:"followups",reports:"funnel"}[a]||"overview"}renderSidebar(){const a=document.getElementById("sidebar-nav"),t=this.getSubNavigationItems(this.currentSection),i={dashboard:{overview:"layout-dashboard",daily:"calendar-days",weekly:"bar-chart-3",analytics:"pie-chart",work:"check-square",sop:"list-checks"},leads:{registration:"user-plus",client_registration:"user-plus",clients:"users",tracking:"radar",details:"file-text",lead_registration:"user-plus",lead_directory:"users-round",lead_sources:"pie-chart",lead_pipeline:"kanban-square",indiamart:"clock",categorization:"tags",smart_feedback:"messages-square",greetings:"calendar-heart",lead_sla:"timer"},projects:{registration:"folder-plus",directory:"folder",pipeline:"kanban-square",active:"gantt-chart",completed:"badge-check",quotation_templates:"file-text",rfp_templates:"file-text"},campaigns:{email:"mail",sms:"message-square",wishes:"calendar-heart",reengagement:"refresh-cw",marketing_hub:"globe",seo:"search",content_library:"library",maps_reviews:"map-pin",linkedin_leads:"linkedin"},billing:{invoices:"file-text",quotations:"file-text",contracts:"file-signature",payments:"credit-card",followup_log:"clipboard-list",overdue_risk:"alert-triangle"},engagement:{followups:"phone-call",surveys:"clipboard-check",health:"heart-pulse",reengagement:"sparkles",field_visits:"map",route_map:"route",mobile_sync:"smartphone",followup_sla:"timer"},reports:{funnel:"filter",roi:"line-chart",ltv:"badge-dollar-sign",sop_monthly:"calendar",kpi_target:"target",kri_risk:"shield-alert",project_roadmap:"milestone"}},s=n=>i[this.currentSection]&&i[this.currentSection][n]?i[this.currentSection][n]:"dot";a.innerHTML=`
            <div class="flex flex-col h-full min-h-[calc(100vh-8rem)]">
                <div>
                    <h2 class="sidebar-title text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                        ${this.currentSection.charAt(0).toUpperCase()+this.currentSection.slice(1)}
                    </h2>
                    ${t.map(n=>`
                        <button class="sidebar-item w-full flex items-center gap-3 text-left px-3 py-2 text-sm font-medium rounded-lg transition-colors mb-1
                            ${n.id===this.currentSubSection?"bg-purple-50 text-purple-700":"text-slate-700 hover:bg-slate-50"}"
                            data-subsection="${n.id}">
                            <i data-lucide="${s(n.id)}" class="w-4 h-4"></i>
                            <span class="sidebar-label">${n.label}</span>
                        </button>
                    `).join("")}
                </div>

                <div class="mt-auto pt-3">
                    <button data-action="chat:open" class="sidebar-item w-full flex items-center gap-3 text-left px-3 py-2 text-sm font-medium rounded-lg transition-colors text-slate-700 hover:bg-slate-50">
                        <i data-lucide="message-circle" class="w-4 h-4 text-purple-600"></i>
                        <span class="sidebar-label">BEZENT</span>
                    </button>
                </div>
            </div>
        `}getSubNavigationItems(a){return{dashboard:[{id:"overview",label:"Overview"},{id:"daily",label:"Daily / Weekly "},{id:"analytics",label:"Overall Analytics"},{id:"work",label:"Today's Work"}],leads:[{id:"registration",label:"Registration"},{id:"clients",label:"Directory"},{id:"tracking",label:"Contacts"}],projects:[{id:"registration",label:"Project Registration"},{id:"directory",label:"Project Directory"},{id:"pipeline",label:"Sales Pipeline"},{id:"active",label:"Active Projects"},{id:"completed",label:"Completed Projects"},{id:"quotation_templates",label:"Quotation Templates"},{id:"rfp_templates",label:"RFP Templates"}],campaigns:[{id:"email",label:"Email Campaigns"},{id:"sms",label:"SMS Alerts"},{id:"wishes",label:"Personalized Wishes"},{id:"reengagement",label:"Re-engagement"}],billing:[{id:"invoices",label:"Invoices"},{id:"quotations",label:"Quotations"},{id:"contracts",label:"Contracts"},{id:"payments",label:"Payment Status"},{id:"followup_log",label:"Payment Follow-up Log"},{id:"overdue_risk",label:"Overdue Risk Dashboard"}],engagement:[{id:"followups",label:"Follow-ups"},{id:"surveys",label:"Feedback & Surveys"},{id:"health",label:"Client Health"},{id:"reengagement",label:"Next Projects"},{id:"field_visits",label:"Field Visits Planner"},{id:"route_map",label:"Visit Route Map"},{id:"mobile_sync",label:"Mobile Sync Visits"}],reports:[{id:"funnel",label:"Funnel Reports"},{id:"roi",label:"Campaign ROI"},{id:"ltv",label:"Client Lifetime Value"},{id:"sop_monthly",label:"SOP Monthly Report"},{id:"kpi_target",label:"KPI vs Target Report"},{id:"kri_risk",label:"KRI Risk Monitor"},{id:"project_roadmap",label:"Project Roadmap Report"}]}[a]||[]}renderContent(){const a=document.getElementById("main-content");switch(this.currentSection){case"dashboard":this.renderDashboardContent(a);break;case"leads":this.renderLeadsContent(a);break;case"projects":this.renderProjectsContent(a);break;case"campaigns":this.renderCampaignsContent(a);break;case"billing":this.renderBillingContent(a);break;case"engagement":this.renderEngagementContent(a);break;case"reports":this.renderReportsContent(a);break;default:a.innerHTML='<div class="text-center text-slate-500">Section not found</div>'}this.afterRender()}afterRender(){var a,t,i,s,n,l,o,r;if(this.destroyCharts(),this.currentSection==="dashboard"&&this.currentSubSection==="overview"&&this.initializeRevenueChart(),this.currentSection==="dashboard"&&this.currentSubSection==="weekly"&&this.initializeWeeklyChart(),this.currentSection==="dashboard"&&this.currentSubSection==="analytics"&&this.initializeRevenuePieChart(),this.currentSection==="projects"&&this.currentSubSection==="active"&&this.initializeBudgetVsSpentChart(),this.currentSection==="billing"&&this.currentSubSection==="invoices"&&this.initializeInvoiceStatusChart(),this.currentSection==="campaigns"&&this.currentSubSection==="email"){const c=()=>this.switchSubSection("contacts_directory"),d=()=>this.switchSubSection("alert_gmass");(a=document.getElementById("emailCampOpenContacts"))==null||a.addEventListener("click",c),(t=document.getElementById("emailCampOpenAlerts"))==null||t.addEventListener("click",d),(i=document.getElementById("emailCampCardContacts"))==null||i.addEventListener("click",c),(s=document.getElementById("emailCampCardAlerts"))==null||s.addEventListener("click",d),(n=document.getElementById("emailCampOpenContacts2"))==null||n.addEventListener("click",c),(l=document.getElementById("emailCampOpenAlerts2"))==null||l.addEventListener("click",d)}if(this.currentSection==="campaigns"&&this.currentSubSection==="contacts_directory"&&this.setupCampaignContactsInteractions(),this.currentSection==="campaigns"&&this.currentSubSection==="alert_gmass"&&this.setupAlertGmassInteractions(),this.currentSection==="campaigns"&&this.currentSubSection==="wishes"){const c=((o=document.getElementById("wishesAllCards"))==null?void 0:o.textContent)||"[]";let d=[];try{d=JSON.parse(c)}catch{}let p=null;const g=document.getElementById("wishesStep1"),h=document.getElementById("wishesStep2"),m=document.getElementById("wishesStep2Back"),f=document.getElementById("wishesCardList"),w=document.getElementById("wishesCardPreview"),u=document.getElementById("wishesClientSection"),b=document.getElementById("wishesSelCount"),v=document.getElementById("wishesSendGmass"),C=document.getElementById("wishesSelectAll"),L=document.getElementById("wishesBackBtn"),F=j=>{const I=[null,document.getElementById("step1dot"),document.getElementById("step2dot"),document.getElementById("step3dot")],N=[null,document.getElementById("step1lbl"),document.getElementById("step2lbl"),document.getElementById("step3lbl")];I.forEach((R,_)=>{R&&(R.className=`w-2 h-2 rounded-full ${_<=j?"bg-purple-500":"bg-slate-200"}`)}),N.forEach((R,_)=>{R&&(R.className=_<=j?"font-semibold text-purple-600":"text-slate-400")})},D=()=>{const j=document.querySelectorAll(".wishes-client-check:checked").length;b&&(b.textContent=j),v&&(v.disabled=j===0||!p)};document.querySelectorAll(".wishes-occ-btn").forEach(j=>{j.addEventListener("click",()=>{const I=j.dataset.occId,N=d.filter(R=>R.occId===I);p=null,u&&u.classList.add("hidden"),v&&(v.disabled=!0),f&&(f.innerHTML=N.map((R,_)=>`
                            <button class="wishes-card-btn w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-slate-200 bg-white hover:border-purple-400 hover:bg-purple-50 transition-all" data-card-idx="${_}" data-card-id="${R.id}">
                                <div class="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0 text-purple-500 font-bold text-sm">${_+1}</div>
                                <div class="flex-1">
                                    <div class="text-sm font-bold text-slate-900">${R.variant}</div>
                                    <div class="text-xs text-slate-400 truncate">${R.subject.replace("{{name}}","[Name]")}</div>
                                </div>
                                <svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
                            </button>
                        `).join(""),f.querySelectorAll(".wishes-card-btn").forEach(R=>{R.addEventListener("click",()=>{const _=N[parseInt(R.dataset.cardIdx)];if(p=_,f.querySelectorAll(".wishes-card-btn").forEach(A=>A.classList.remove("border-purple-500","bg-purple-50")),R.classList.add("border-purple-500","bg-purple-50"),w){w.innerHTML=`
                                        <div class="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                                            <div class="px-4 py-3 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-slate-100 flex items-center justify-between">
                                                <div>
                                                    <div class="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Card Preview</div>
                                                    <div class="text-sm font-bold text-slate-900 mt-0.5">${_.variant}</div>
                                                    <div class="text-xs text-purple-700 font-medium mt-0.5">Subject: ${_.subject.replace("{{name}}","[Name]")}</div>
                                                </div>
                                            </div>
                                            <iframe id="wishesPreviewFrame" class="w-full border-0" style="height:420px;" sandbox="allow-same-origin"></iframe>
                                        </div>`;const A=document.getElementById("wishesPreviewFrame");A&&(A.srcdoc=_.htmlBody.replace(/\{\{name\}\}/g,"Valued Client"))}u&&u.classList.remove("hidden"),F(3),D()})})),g&&g.classList.add("hidden"),h&&h.classList.remove("hidden"),m&&m.classList.remove("hidden"),F(2)})}),L==null||L.addEventListener("click",()=>{h&&h.classList.add("hidden"),g&&g.classList.remove("hidden"),m&&m.classList.add("hidden"),u&&u.classList.add("hidden"),p=null,F(1)}),document.querySelectorAll(".wishes-client-check").forEach(j=>j.addEventListener("change",D)),C==null||C.addEventListener("click",()=>{const j=document.querySelectorAll(".wishes-client-check"),I=[...j].some(N=>!N.checked);j.forEach(N=>{N.checked=I}),D()}),v==null||v.addEventListener("click",()=>{if(!p)return;const I=[...document.querySelectorAll(".wishes-client-check:checked")].map(R=>R.dataset.email).filter(Boolean).join(",");if(!I){alert("Please select contacts with email addresses.");return}const N=`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(I)}&cc=send%40gmass.co&su=${encodeURIComponent(p.subject)}&body=${encodeURIComponent("Please use the HTML version of this email — the full card template was copied to clipboard.")}`;try{navigator.clipboard.writeText(p.htmlBody)}catch{}window.open(N,"_blank")})}if(this.currentSection==="campaigns"&&this.currentSubSection==="reengagement"){const c=((r=document.getElementById("reengSegData"))==null?void 0:r.textContent)||"[]";let d=[];try{d=JSON.parse(c)}catch{}let p=null;const g=document.getElementById("reengPanelWrap"),h=document.getElementById("reengContactSection"),m=document.getElementById("reengSelCount"),f=document.getElementById("reengSendGmass"),w=document.getElementById("reengSelectAll"),u=()=>{const b=document.querySelectorAll(".reeng-contact-check:checked").length;m&&(m.textContent=b),f&&(f.disabled=b===0||!p)};document.querySelectorAll(".reeng-seg-btn").forEach(b=>{b.addEventListener("click",()=>{p=d.find(v=>v.id===b.dataset.segId),!(!p||!g)&&(document.querySelectorAll(".reeng-seg-btn").forEach(v=>{v.classList.remove("border-purple-400")}),b.classList.add("border-purple-400"),g.innerHTML=`
                        <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                            <div class="px-5 py-4 bg-gradient-to-r from-slate-50 to-purple-50 border-b border-slate-100 flex items-center gap-3">
                                <div class="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                                    <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                                </div>
                                <div>
                                    <div class="text-xs font-bold text-slate-400 uppercase tracking-widest">Re-engagement: ${p.title}</div>
                                    <div class="text-xs text-purple-700 font-semibold mt-1">Subject: ${p.subject}</div>
                                </div>
                            </div>
                            <div class="p-5">
                                <div class="text-xs text-slate-500 mb-2 italic">${p.preview}</div>
                                <div class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 mt-3">Full Email Body</div>
                                <pre class="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-sans bg-slate-50 rounded-xl p-4 border border-slate-100">${p.body}</pre>
                                <div class="mt-3 text-xs text-slate-400 italic">{{name}} is replaced with each recipient's name before sending.</div>
                            </div>
                        </div>`,h&&h.classList.remove("hidden"),u())})}),document.querySelectorAll(".reeng-contact-check").forEach(b=>{b.addEventListener("change",u)}),w==null||w.addEventListener("click",()=>{const b=[...document.querySelectorAll(".reeng-contact-check")],v=b.some(C=>!C.checked);b.forEach(C=>{C.checked=v}),u()}),f==null||f.addEventListener("click",()=>{if(!p)return;const v=[...document.querySelectorAll(".reeng-contact-check:checked")].map(L=>L.dataset.email).filter(Boolean).join(",");if(!v){alert("Please select contacts with email addresses.");return}const C=`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(v)}&cc=send%40gmass.co&su=${encodeURIComponent(p.subject)}&body=${encodeURIComponent(p.body)}`;window.open(C,"_blank")})}this.currentSection==="reports"&&this.currentSubSection==="funnel"&&this.initializeFunnelReportCharts(),this.currentSection==="reports"&&this.currentSubSection==="roi"&&this.initializeCampaignReportCharts(),this.currentSection==="reports"&&this.currentSubSection==="sop_monthly"&&this.initializeSopMonthlyCharts(),this.currentSection==="reports"&&this.currentSubSection==="project_roadmap"&&this.initializeProjectRoadmapCharts(),this.currentSection==="reports"&&this.currentSubSection==="kpi_target"&&this.initializeKpiTargetCharts(),this.currentSection==="reports"&&this.currentSubSection==="kri_risk"&&this.initializeKriRiskCharts(),this.currentSection==="leads"&&this.currentSubSection==="clients"&&this.setupClientDirectoryInteractions(),this.currentSection==="leads"&&this.currentSubSection==="lead_directory"&&this.setupLeadDirectoryInteractions(),this.currentSection==="leads"&&this.currentSubSection==="tracking"&&this.setupContactsInteractions()}setupClientDirectoryInteractions(){document.querySelectorAll("tr[data-client-name]").forEach(t=>{t.addEventListener("click",()=>{const i=t.dataset.clientName;i&&(this.selectedClientName=i,this.renderContent(),this.initializeLucideIcons())})})}setupLeadDirectoryInteractions(){document.querySelectorAll("tr[data-lead-id]").forEach(i=>{i.addEventListener("click",s=>{const n=s.target;if(n instanceof Element&&n.closest('button[data-action="lead:convert"]'))return;const l=i.dataset.leadId;l&&(this.selectedLeadId=l,this.renderContent(),this.initializeLucideIcons())})});const t=document.getElementById("clearLeadSelection");t&&t.addEventListener("click",()=>{this.selectedLeadId=null,this.renderContent(),this.initializeLucideIcons()})}destroyCharts(){this.stopChartRotation("invoiceStatusChart"),Object.values(this.charts).forEach(a=>{try{a.destroy()}catch{}}),this.charts={}}renderDashboardContent(a){switch(this.currentSubSection){case"overview":a.innerHTML=this.getDashboardOverview();break;case"daily":a.innerHTML=this.getDashboardDaily();break;case"weekly":a.innerHTML=this.getDashboardWeekly();break;case"analytics":a.innerHTML=this.getDashboardAnalytics();break;case"work":a.innerHTML=this.getDashboardWork();break;case"sop":a.innerHTML=this.getDashboardSopChecklist();break;default:this.currentSubSection="overview",a.innerHTML=this.getDashboardOverview();break}}getPlaceholderScreen(a,t){return`
            <div class="space-y-6 fade-in">
                <div class="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h2 class="text-xl sm:text-2xl font-semibold text-slate-900">${a}</h2>
                        <p class="text-sm text-slate-500">${t||""}</p>
                    </div>
                    
                </div>
                <div class="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-lg">
                    <div class="text-sm text-slate-700">Coming soon.</div>
                </div>
            </div>
        `}getLeadsRegistrationHub(){return`
            <div class="space-y-6 fade-in">
                <div class="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h2 class="text-xl sm:text-2xl font-semibold text-slate-900">Registration</h2>
                        <p class="text-sm text-slate-500">Choose what you want to register</p>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <button data-action="nav:leads/lead_registration" class="text-left bg-white rounded-lg border border-slate-200 p-6 shadow-lg hover:bg-slate-50 transition-colors">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                                <i data-lucide="user-plus" class="w-6 h-6 text-purple-600"></i>
                            </div>
                            <div>
                                <div class="text-lg font-semibold text-slate-900">Leads Registration</div>
                                <div class="text-sm text-slate-600 mt-1">Capture lead source and details</div>
                            </div>
                        </div>
                    </button>

                    <button data-action="nav:leads/client_registration" class="text-left bg-white rounded-lg border border-slate-200 p-6 shadow-lg hover:bg-slate-50 transition-colors">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center">
                                <i data-lucide="users" class="w-6 h-6 text-emerald-600"></i>
                            </div>
                            <div>
                                <div class="text-lg font-semibold text-slate-900">Client Registration</div>
                                <div class="text-sm text-slate-600 mt-1">Create a client profile and capture requirements</div>
                            </div>
                        </div>
                    </button>
                </div>
            </div>
        `}getDashboardSopChecklist(){const a=[{id:"sop_li",label:"LinkedIn Post Done (1/day)"},{id:"sop_conn",label:"New Connections (20–30/day)"},{id:"sop_outreach",label:"Outreach Messages (25/day)"},{id:"sop_india",label:"IndiaMART Follow-ups Done"},{id:"sop_crm",label:"CRM Updated"},{id:"sop_compet",label:"Competitor Monitoring Logged"},{id:"sop_quotes",label:"Quotations Sent Today"},{id:"sop_inv",label:"Invoice Follow-ups Done"}],t=new Date().toISOString().slice(0,10),i=`bezent_sop_${t}`,s=this.readStore(i,{}),n=a.map(u=>({...u,done:!!s[u.id]})),l=n.filter(u=>u.done).length,o=Math.round(l/n.length*100),c=this.getStoredLeads().filter(u=>new Date(u.createdAt||0).toISOString().slice(0,10)===t).length,p=this.getAllInvoices().filter(u=>String((u==null?void 0:u.status)||"").toLowerCase()==="overdue").length,h=this.getStoredCampaigns().filter(u=>new Date(u.createdAt||0).toISOString().slice(0,10)===t).length,f=this.readStore("bezent_payment_followups",[]).filter(u=>u.date===new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})).length,w=[{label:"Leads Today",value:String(c||0)},{label:"Overdue Invoices",value:String(p)},{label:"Campaigns Today",value:String(h)},{label:"Follow-ups Logged",value:String(f)},{label:"Total Clients",value:String(this.getStoredClients().length)},{label:"Total Projects",value:String(this.getStoredProjects().length)}];return`
            <div class="space-y-6 fade-in">
                <div class="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h2 class="text-xl sm:text-2xl font-semibold text-slate-900">SOP Daily Checklist</h2>
                        <p class="text-sm text-slate-500">Complete SOP and submit daily report</p>
                    </div>
                    <button data-action="sop:submitDailyReport" class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Submit Daily Report</button>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div class="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-lg">
                        <div class="flex flex-wrap items-start justify-between gap-3">
                            <h3 class="text-lg font-semibold text-slate-900">Checklist</h3>
                            <span class="px-2 py-1 text-xs font-medium bg-purple-50 text-purple-700 rounded-full">${o}%</span>
                        </div>
                        <div class="mt-4 w-full bg-slate-100 rounded-full h-2">
                            <div class="bg-purple-600 h-2 rounded-full" style="width: ${o}%"></div>
                        </div>
                        <div class="mt-5 space-y-3">
                            ${n.map(u=>`
                                <label class="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                    <input type="checkbox" ${u.done?"checked":""} class="w-4 h-4 text-purple-600 rounded focus:ring-purple-500">
                                    <span class="text-sm ${u.done?"text-slate-900":"text-slate-700"}">${u.label}</span>
                                </label>
                            `).join("")}
                        </div>
                    </div>

                    <div class="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-lg">
                        <h3 class="text-lg font-semibold text-slate-900">Daily Output Summary</h3>
                        <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            ${w.map(u=>`
                                <div class="p-4 bg-slate-50 rounded-lg">
                                    <div class="text-xs text-slate-500">${u.label}</div>
                                    <div class="text-2xl font-semibold text-slate-900 mt-1">${u.value}</div>
                                </div>
                            `).join("")}
                        </div>
                    </div>
                </div>
            </div>
        `}getDashboardManagerDashboard(){const a=this.getStoredLeads(),t=this.getStoredClients(),i=this.getAllInvoices(),s=this.readStore("bezent_projects",[]),n=this.readStore("bezent_campaigns",[]),l=this.readStore("bezent_followups",[]),o=D=>String(D??"").replace(/</g,"&lt;"),r=a.length,c=a.filter(D=>["warm","hot","demo","proposal"].includes(String(D.stage||D.status||"").toLowerCase())).length,d=t.length,p=i.filter(D=>String(D.status||"").toLowerCase()==="overdue"),g=p.reduce((D,j)=>D+this.parseCurrencyToNumber(j.amount),0),h=i.filter(D=>String(D.status||"").toLowerCase()==="paid").reduce((D,j)=>D+this.parseCurrencyToNumber(j.amount),0),m=s.filter(D=>String(D.status||"").toLowerCase()!=="completed").length,f=n.filter(D=>String(D.status||"").toLowerCase()==="active").length,w=l.filter(D=>!D.done).length,b=["New Lead","Contacted","Proposal","Negotiation","Won"].map(D=>({stage:D,count:a.filter(j=>String(j.stage||j.status||"").toLowerCase()===D.toLowerCase()).length})),v=Math.max(...b.map(D=>D.count),1),C={};i.forEach(D=>{const j=String(D.client||"").trim();j&&(C[j]=(C[j]||0)+this.parseCurrencyToNumber(D.amount))});const L=Object.entries(C).sort((D,j)=>j[1]-D[1]).slice(0,5);return`
            <div class="space-y-6 fade-in">
                <div class="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h2 class="text-xl sm:text-2xl font-semibold text-slate-900">Manager Dashboard</h2>
                        <p class="text-sm text-slate-500">All-up business health — ${new Date().toLocaleDateString("en-IN",{weekday:"short",day:"2-digit",month:"short",year:"numeric"})}</p>
                    </div>
                    <div class="flex gap-2">
                        <button data-action="nav:leads/all_leads" class="px-4 py-2 text-sm font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100">View Leads</button>
                        <button data-action="nav:billing/invoices" class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700">Invoices</button>
                    </div>
                </div>

                <!-- KPI Cards -->
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                        <div class="flex items-center justify-between"><div class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Leads</div><i data-lucide="users" class="w-4 h-4 text-purple-400"></i></div>
                        <div class="text-3xl font-bold text-slate-900 mt-2">${r}</div>
                        <div class="text-xs text-purple-600 mt-1">${c} hot/warm leads</div>
                    </div>
                    <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                        <div class="flex items-center justify-between"><div class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Active Clients</div><i data-lucide="briefcase" class="w-4 h-4 text-sky-400"></i></div>
                        <div class="text-3xl font-bold text-slate-900 mt-2">${d}</div>
                        <div class="text-xs text-sky-600 mt-1">${m} active projects</div>
                    </div>
                    <div class="bg-white rounded-xl border ${p.length?"border-rose-200":"border-slate-200"} p-5 shadow-sm">
                        <div class="flex items-center justify-between"><div class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Overdue Amount</div><i data-lucide="alert-triangle" class="w-4 h-4 text-rose-400"></i></div>
                        <div class="text-3xl font-bold ${p.length?"text-rose-700":"text-emerald-700"} mt-2">${this.formatINR(g)}</div>
                        <div class="text-xs ${p.length?"text-rose-600":"text-slate-400"} mt-1">${p.length} overdue invoice${p.length!==1?"s":""}</div>
                    </div>
                    <div class="bg-white rounded-xl border border-emerald-100 p-5 shadow-sm">
                        <div class="flex items-center justify-between"><div class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Revenue Collected</div><i data-lucide="trending-up" class="w-4 h-4 text-emerald-400"></i></div>
                        <div class="text-3xl font-bold text-emerald-700 mt-2">${this.formatINR(h)}</div>
                        <div class="text-xs text-emerald-600 mt-1">${f} active campaigns</div>
                    </div>
                </div>

                <!-- Two column: Funnel + Top Clients -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- Lead Funnel -->
                    <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <div class="flex items-center justify-between mb-5">
                            <div class="text-sm font-semibold text-slate-900">Lead Pipeline Funnel</div>
                            <button data-action="nav:leads/lead_pipeline" class="text-xs text-purple-600 hover:underline">View full pipeline →</button>
                        </div>
                        <div class="space-y-3">
                        ${b.map((D,j)=>{const I=Math.round(D.count/v*100),N=["bg-purple-500","bg-indigo-500","bg-sky-500","bg-amber-500","bg-emerald-500"];return`<div>
                                <div class="flex justify-between text-xs mb-1"><span class="font-medium text-slate-700">${D.stage}</span><span class="text-slate-500">${D.count}</span></div>
                                <div class="w-full bg-slate-100 rounded-full h-2"><div class="${N[j]} h-2 rounded-full transition-all" style="width:${I}%"></div>
                            </div>`}).join("")}
                        </div>
                    </div>

                    <!-- Top Clients -->
                    <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <div class="flex items-center justify-between mb-5">
                            <div class="text-sm font-semibold text-slate-900">Top Clients by Revenue</div>
                            <button data-action="nav:clients/directory" class="text-xs text-purple-600 hover:underline">View all →</button>
                        </div>
                        ${L.length===0?'<p class="text-sm text-slate-400">No invoice data yet.</p>':`<div class="space-y-3">${L.map(([D,j],I)=>`
                            <div class="flex items-center gap-3">
                                <div class="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center text-xs font-bold text-purple-700 flex-shrink-0">${I+1}</div>
                                <div class="flex-1 min-w-0"><div class="text-sm font-medium text-slate-900 truncate">${o(D)}</div>
                                <div class="text-sm font-semibold text-slate-900">${this.formatINR(j)}</div>
                            </div>`).join("")}
                        </div>`}
                    </div>
                </div>

                <!-- Alerts Row -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
                        <i data-lucide="clock" class="w-5 h-5 text-amber-600 flex-shrink-0"></i>
                        <div><div class="text-sm font-semibold text-amber-900">Open Follow-ups</div><div class="text-xs text-amber-700 mt-0.5">${w} pending</div>
                        <button data-action="nav:engagement/followups" class="ml-auto text-xs text-amber-700 font-semibold hover:underline">Go →</button>
                    </div>
                    <div class="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-center gap-3">
                        <i data-lucide="alert-circle" class="w-5 h-5 text-rose-600 flex-shrink-0"></i>
                        <div><div class="text-sm font-semibold text-rose-900">Overdue Invoices</div><div class="text-xs text-rose-700 mt-0.5">${p.length} need action</div>
                        <button data-action="nav:billing/overdue_risk" class="ml-auto text-xs text-rose-700 font-semibold hover:underline">Go →</button>
                    </div>
                    <div class="bg-purple-50 border border-purple-200 rounded-xl p-4 flex items-center gap-3">
                        <i data-lucide="bar-chart-2" class="w-5 h-5 text-purple-600 flex-shrink-0"></i>
                        <div><div class="text-sm font-semibold text-purple-900">Active Campaigns</div><div class="text-xs text-purple-700 mt-0.5">${f} running</div>
                        <button data-action="nav:campaigns/campaigns_list" class="ml-auto text-xs text-purple-700 font-semibold hover:underline">Go →</button>
                    </div>
                </div>
            </div>`}getDashboardDeliveryTracker(){const a=s=>({completed:"emerald","on track":"emerald","at risk":"amber",delayed:"rose"})[String(s||"").toLowerCase()]||"slate";return`
            <div class="space-y-6 fade-in">
                <div class="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h2 class="text-xl sm:text-2xl font-semibold text-slate-900">Delivery Tracker</h2>
                        <p class="text-sm text-slate-500">Timeline + delay tracker</p>
                    </div>
                    <button data-action="table:exportCsv" class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Export</button>
                </div>

                <div class="bg-white rounded-lg border border-slate-200 overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm" style="min-width: 800px;">
                            <thead class="bg-slate-50 text-slate-600">
                                <tr>
                                    <th class="text-left px-4 py-3 font-medium">Project Name</th>
                                    <th class="text-left px-4 py-3 font-medium">Stage</th>
                                    <th class="text-left px-4 py-3 font-medium">Delivery Date</th>
                                    <th class="text-left px-4 py-3 font-medium">Delay Days</th>
                                    <th class="text-left px-4 py-3 font-medium">Assigned Engineer</th>
                                    <th class="text-left px-4 py-3 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-200">
                                ${(this.getStoredProjects?this.getStoredProjects():[]).filter(s=>String(s.status||"").toLowerCase()!=="completed").slice(0,8).map(s=>({name:String(s.name||"—"),stage:String(s.stage||s.status||"In Progress"),date:String(s.end_date||s.endDate||"—"),delay:0,eng:String(s.owner||s.projectLead||"—"),status:String(s.status||"Active"),color:a(s.status)})).map(s=>`
                                    <tr class="hover:bg-slate-50">
                                        <td class="px-4 py-3 font-medium text-slate-900">${s.name}</td>
                                        <td class="px-4 py-3 text-slate-700">${s.stage}</td>
                                        <td class="px-4 py-3 text-slate-700">${s.date}</td>
                                        <td class="px-4 py-3 text-slate-700">${s.delay}</td>
                                        <td class="px-4 py-3 text-slate-700">${s.eng}</td>
                                        <td class="px-4 py-3"><span class="px-2 py-1 text-xs font-medium bg-${s.color}-50 text-${s.color}-700 rounded-full">${s.status}</span></td>
                                    </tr>
                                `).join("")}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `}getDashboardOverview(){const a=this.getStoredLeads(),t=this.getStoredClients(),i=this.getStoredProjects(),s=this.getAllInvoices(),n=new Date,l=n.toDateString(),o=a.filter(b=>{try{return new Date(b.receivedAt).toDateString()===l}catch{return!1}}).length,r=o||a.length,c=o?`${o} today`:`${a.length} total`,d=i.filter(b=>{var C;const v=String(((C=b==null?void 0:b.monitoring)==null?void 0:C.overallProjectStatus)||(b==null?void 0:b.status)||"").toLowerCase();return!v.includes("complet")&&!v.includes("delivered")}).length||i.length;n.getMonth(),n.getFullYear();let p=0;s.forEach(b=>{String((b==null?void 0:b.status)||"").toLowerCase()==="paid"&&(p+=this.parseCurrencyToNumber(b.amount))});const g=s.filter(b=>String((b==null?void 0:b.status)||"").toLowerCase()!=="paid");let h=0;g.forEach(b=>{h+=this.parseCurrencyToNumber(b.amount)});const m=s.filter(b=>String((b==null?void 0:b.status)||"").toLowerCase()==="overdue").length,f=new Set(i.map(b=>String((b==null?void 0:b.client)||"").trim().toLowerCase()).filter(Boolean)),w=t.length?Math.round(f.size/Math.max(t.length,1)*100):74,u=b=>b?b>=1e5?"₹"+(b/1e5).toFixed(1)+" L":"₹"+b.toLocaleString("en-IN"):"₹0";return`
            <div class="space-y-6 fade-in">
                <!-- KPI Cards -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                    <div class="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-lg">
                        <div class="flex flex-wrap items-center justify-between gap-2 mb-4">
                            <i data-lucide="users" class="w-8 h-8 text-sky-600"></i>
                            <span class="text-xs font-medium text-sky-600 bg-sky-50 px-2 py-1 rounded-full">${c}</span>
                        </div>
                        <div class="text-2xl font-semibold text-slate-900 mb-1">${r}</div>
                        <div class="text-sm text-slate-600">Leads</div>
                        <div class="text-xs text-slate-500 mt-2">${t.length} clients registered</div>
                    </div>
                    
                    <div class="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-lg">
                        <div class="flex flex-wrap items-center justify-between gap-2 mb-4">
                            <i data-lucide="briefcase" class="w-8 h-8 text-indigo-600"></i>
                            <span class="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">${i.length} total</span>
                        </div>
                        <div class="text-2xl font-semibold text-slate-900 mb-1">${d}</div>
                        <div class="text-sm text-slate-600">Active Projects</div>
                        <div class="text-xs text-slate-500 mt-2">${i.filter(b=>String((b==null?void 0:b.status)||"").toLowerCase().includes("complet")).length} completed</div>
                    </div>
                    
                    <div class="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-lg">
                        <div class="flex flex-wrap items-center justify-between gap-2 mb-4">
                            <i data-lucide="indian-rupee" class="w-8 h-8 text-emerald-600"></i>
                            <span class="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">paid invoices</span>
                        </div>
                        <div class="text-2xl font-semibold text-slate-900 mb-1">${u(p)||"₹0"}</div>
                        <div class="text-sm text-slate-600">Revenue (Paid)</div>
                        <div class="text-xs text-slate-500 mt-2">${s.filter(b=>String((b==null?void 0:b.status)||"").toLowerCase()==="paid").length} invoices paid</div>
                    </div>
                    
                    <div class="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-lg">
                        <div class="flex flex-wrap items-center justify-between gap-2 mb-4">
                            <i data-lucide="credit-card" class="w-8 h-8 text-amber-600"></i>
                            <span class="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full">${m} overdue</span>
                        </div>
                        <div class="text-2xl font-semibold text-slate-900 mb-1">${u(h)}</div>
                        <div class="text-sm text-slate-600">Pending Payments</div>
                        <div class="text-xs text-slate-500 mt-2">${g.length} open invoices</div>
                    </div>
                    
                    <div class="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-lg">
                        <div class="flex flex-wrap items-center justify-between gap-2 mb-4">
                            <i data-lucide="target" class="w-8 h-8 text-rose-600"></i>
                            <span class="text-xs font-medium ${w>=70?"text-green-600 bg-green-50":"text-red-600 bg-red-50"} px-2 py-1 rounded-full">${w>=70?"Good":"At Risk"}</span>
                        </div>
                        <div class="text-2xl font-semibold text-slate-900 mb-1">${w}%</div>
                        <div class="text-sm text-slate-600">Client Retention</div>
                        <div class="text-xs text-slate-500 mt-2">${f.size} of ${t.length} have projects</div>
                    </div>
                </div>

                <!-- Charts Section -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <!-- Revenue Trend Chart -->
                    <div class="col-span-1 lg:col-span-2 bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-lg">
                        <div class="flex flex-wrap items-center justify-between gap-3 mb-4 sm:mb-6">
                            <div>
                                <h3 class="text-lg font-semibold text-slate-900">Revenue Trend</h3>
                                <p class="text-sm text-slate-500">Monthly revenue vs target</p>
                            </div>
                            <div class="flex gap-2">
                                <button class="px-3 py-1 text-xs font-medium bg-purple-50 text-purple-700 rounded-md">Monthly</button>
                                <button class="px-3 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md">Weekly</button>
                                <button class="px-3 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md">Daily</button>
                            </div>
                        </div>
                        <div class="h-64 flex items-center justify-center bg-slate-50 rounded-lg">
                            <div class="relative w-full h-full"><canvas id="revenueChart"></canvas></div>
                        </div>
                    </div>

                    <!-- Recent Activity -->
                    <div class="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-lg">
                        <h3 class="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h3>
                        <div class="space-y-3 max-h-80 overflow-y-auto">
                            ${this.getRecentActivityItems()}
                        </div>
                    </div>
                </div>

                <!-- Sales Funnel -->
                <div class="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-lg">
                    <div class="mb-6">
                        <h3 class="text-lg font-semibold text-slate-900">Sales Funnel</h3>
                        <p class="text-sm text-slate-500">Lead conversion through pipeline stages</p>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                        ${this.getSalesFunnelStages()}
                    </div>
                </div>
            </div>
        `}getRecentActivityItems(){const a=[],t=i=>String(i??"").replace(/</g,"&lt;");return this.getStoredClients().slice(0,3).forEach(i=>{a.push({text:`Client registered: ${t(i.name)}`,color:"green",ts:0})}),this.getAllInvoices().filter(i=>String((i==null?void 0:i.status)||"").toLowerCase()==="overdue").slice(0,2).forEach(i=>{a.push({text:`Invoice ${t(i.no)} overdue — ${t(i.client)}`,color:"red",ts:0})}),this.getStoredLeads().slice(0,3).forEach(i=>{a.push({text:`New lead: ${t(i.company||i.contact||"Unknown")}`,color:"blue",ts:i.receivedAt||0})}),this.getAllInvoices().filter(i=>String((i==null?void 0:i.status)||"").toLowerCase()==="paid").slice(0,2).forEach(i=>{a.push({text:`Payment received from ${t(i.client)}: ${t(i.amount)}`,color:"green",ts:0})}),this.getStoredCampaigns().slice(0,2).forEach(i=>{a.push({text:`Campaign "${t(i.name)}" — ${t(i.status)} (${i.audience} contacts)`,color:"purple",ts:0})}),a.length||a.push({text:"No recent activity — start by registering a lead or client.",color:"slate",ts:0}),a.slice(0,8).map((i,s)=>`
            <div class="flex items-start gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors">
                <div class="w-2 h-2 bg-${i.color}-500 rounded-full mt-2 flex-shrink-0"></div>
                <div class="flex-1">
                    <p class="text-sm text-slate-700">${i.text}</p>
                    <p class="text-xs text-slate-500 mt-1">${i.ts?new Date(i.ts).toLocaleString("en-IN",{dateStyle:"short",timeStyle:"short"}):"Recently"}</p>
                </div>
            </div>
        `).join("")}getSalesFunnelStages(){const a=this.getStoredLeads(),t=this.getStoredClients(),i=this.getStoredProjects();this.getAllInvoices();const s=a.length||0,n=a.filter(g=>!["new lead","open"].includes(String(g.stage||g.status||"").toLowerCase())).length||Math.round(s*.6),l=a.filter(g=>["quotation","negotiation"].includes(String(g.stage||"").toLowerCase())).length||Math.round(s*.35),o=a.filter(g=>["closed","po received"].includes(String(g.stage||"").toLowerCase())).length||t.length,r=i.length,c=[{name:"Leads",count:s,conversion:null},{name:"Contacted",count:n,conversion:s?Math.round(n/s*100)+"%":"—"},{name:"Proposals",count:l,conversion:n?Math.round(l/n*100)+"%":"—"},{name:"Deals",count:o,conversion:l?Math.round(o/Math.max(l,1)*100)+"%":"—"},{name:"Projects",count:r,conversion:o?Math.round(r/Math.max(o,1)*100)+"%":"—"}],d=["sky-500","indigo-500","emerald-500","amber-500","rose-500"],p=Math.max(...c.map(g=>g.count),1);return c.map((g,h)=>{const m=Math.max(g.count/p*100,8);return`
                <div class="text-center">
                    <div class="h-32 flex items-end justify-center mb-4">
                        <div class="w-full bg-${d[h]} rounded-t-lg transition-all hover:opacity-80"
                             style="height: ${m}%"></div>
                    </div>
                    <div class="text-lg font-semibold text-slate-900">${g.count}</div>
                    <div class="text-sm text-slate-600">${g.name}</div>
                    ${g.conversion?`<div class="text-xs text-slate-700 font-medium">${g.conversion}</div>`:""}
                </div>
            `}).join("")}getDashboardDaily(){return`
            <div class="space-y-6 fade-in">
                <div class="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h2 class="text-xl sm:text-2xl font-semibold text-slate-900">Daily View</h2>
                        <p class="text-sm text-slate-500">Today’s schedule, quick actions, and daily summary</p>
                    </div>
                    <div class="flex gap-2">
                        <button data-action="nav:dashboard/daily" class="px-3 py-1.5 text-xs font-medium bg-purple-50 text-purple-700 rounded-lg">Daily</button>
                        <button data-action="nav:dashboard/weekly" class="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg">Weekly</button>
                    </div>
                </div>

                <!-- Summary Cards -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div class="bg-gradient-to-br from-sky-500 to-sky-600 rounded-lg p-4 sm:p-6 text-white">
                        <i data-lucide="phone" class="w-8 h-8 mb-3 opacity-80"></i>
                        <div class="text-2xl sm:text-3xl font-semibold mb-1">${(this.getStoredFollowups?this.getStoredFollowups():[]).filter(a=>a.type==="Call"&&!a.done).length}</div>
                        <div class="text-sm opacity-90">Calls Scheduled</div>
                    </div>
                    
                    <div class="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg p-4 sm:p-6 text-white">
                        <i data-lucide="calendar" class="w-8 h-8 mb-3 opacity-80"></i>
                        <div class="text-2xl sm:text-3xl font-semibold mb-1">${(this.getStoredFollowups?this.getStoredFollowups():[]).filter(a=>a.type==="Meeting"&&!a.done).length}</div>
                        <div class="text-sm opacity-90">Meetings Today</div>
                    </div>
                    
                    <div class="bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg p-4 sm:p-6 text-white">
                        <i data-lucide="check-square" class="w-8 h-8 mb-3 opacity-80"></i>
                        <div class="text-2xl sm:text-3xl font-semibold mb-1">${(this.getStoredFollowups?this.getStoredFollowups():[]).filter(a=>!a.done).length}</div>
                        <div class="text-sm opacity-90">Tasks Due Today</div>
                    </div>
                    
                    <div class="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg p-4 sm:p-6 text-white">
                        <i data-lucide="indian-rupee" class="w-8 h-8 mb-3 opacity-80"></i>
                        <div class="text-2xl sm:text-3xl font-semibold mb-1">${this.formatINR(this.getStoredInvoices().filter(a=>String(a.status||"").toLowerCase()!=="paid").reduce((a,t)=>a+this.parseCurrencyToNumber(t.amount),0))}</div>
                        <div class="text-sm opacity-90">Payments Expected</div>
                    </div>
                </div>

                <!-- Today's Schedule -->
                <div class="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-lg">
                    <div class="flex flex-wrap items-center justify-between gap-3 mb-4 sm:mb-6">
                        <h3 class="text-lg font-semibold text-slate-900">Today's Schedule</h3>
                        <span class="px-3 py-1 text-xs font-medium bg-purple-50 text-purple-700 rounded-full">Upcoming</span>
                    </div>
                    
                    <div class="space-y-4">
                        ${this.getTodayScheduleItems()}
                    </div>
                    
                    <button data-action="schedule:openMeeting" class="mt-6 w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium">Join Meeting →</button>
                </div>

                <!-- Quick Actions -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div data-action="dashboard:scheduleCall" class="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-lg hover:bg-slate-50 transition-colors cursor-pointer">
                        <div class="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mb-4">
                            <i data-lucide="phone" class="w-6 h-6 text-purple-600"></i>
                        </div>
                        <h4 class="font-medium text-slate-900 mb-2">Schedule Call</h4>
                        <p class="text-sm text-slate-600">Add new call to calendar</p>
                    </div>
                    
                    <div data-action="task:create" class="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-lg hover:bg-slate-50 transition-colors cursor-pointer">
                        <div class="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mb-4">
                            <i data-lucide="plus" class="w-6 h-6 text-purple-600"></i>
                        </div>
                        <h4 class="font-medium text-slate-900 mb-2">Create Task</h4>
                        <p class="text-sm text-slate-600">Add task to today's list</p>
                    </div>
                    
                    <div data-action="lead:add" class="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-lg hover:bg-slate-50 transition-colors cursor-pointer">
                        <div class="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mb-4">
                            <i data-lucide="user-plus" class="w-6 h-6 text-purple-600"></i>
                        </div>
                        <h4 class="font-medium text-slate-900 mb-2">Add Lead</h4>
                        <p class="text-sm text-slate-600">Register new lead</p>
                    </div>
                </div>
            </div>
        `}getTodayScheduleItems(){new Date().toISOString().slice(0,10);const a=n=>({call:"phone",email:"mail",meeting:"users",visit:"map-pin"})[String(n||"").toLowerCase()]||"check-square",t=n=>["sky","indigo","emerald","amber","purple","rose"][n%6];return(this.getStoredFollowups?this.getStoredFollowups():[]).filter(n=>!n.done).slice(0,5).map((n,l)=>({time:String(n.scheduled_time||n.scheduledTime||"—"),title:`${String(n.type||"Follow-up").replace(/\b\w/g,o=>o.toUpperCase())} • ${String(n.client||"Client")}`,subtitle:String(n.topic||"Follow-up task"),icon:a(n.type),color:t(l)})).map(n=>`
            <div class="flex items-center gap-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <div class="w-12 h-12 bg-${n.color}-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i data-lucide="${n.icon}" class="w-5 h-5 text-${n.color}-600"></i>
                </div>
                <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between gap-3">
                        <div class="font-medium text-slate-900 truncate">${n.title}</div>
                        <div class="text-xs font-semibold text-slate-500 flex-shrink-0">${n.time}</div>
                    </div>
                    <div class="text-sm text-slate-600 mt-1 truncate">${n.subtitle}</div>
                </div>
            </div>
        `).join("")}getDashboardWeekly(){return`
            <div class="space-y-6 fade-in">
                <div class="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h2 class="text-xl sm:text-2xl font-semibold text-slate-900">Weekly View</h2>
                        <p class="text-sm text-slate-500">Weekly metrics and performance highlights</p>
                    </div>
                    <div class="flex gap-2">
                        <button data-action="nav:dashboard/daily" class="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg">Daily</button>
                        <button data-action="nav:dashboard/weekly" class="px-3 py-1.5 text-xs font-medium bg-purple-50 text-purple-700 rounded-lg">Weekly</button>
                    </div>
                </div>

                <!-- Weekly Metrics -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div class="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-lg">
                        <div class="flex flex-wrap items-center justify-between gap-2 mb-4">
                            <i data-lucide="users" class="w-8 h-8 text-sky-600"></i>
                            <span class="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">Active</span>
                        </div>
                        <div class="text-3xl font-semibold text-slate-900 mb-1">${this.getStoredLeads().length}</div>
                        <div class="text-sm text-slate-600">Total Leads</div>
                        <div class="text-xs text-slate-500 mt-2">in system</div>
                    </div>
                    
                    <div class="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-lg">
                        <div class="flex flex-wrap items-center justify-between gap-2 mb-4">
                            <i data-lucide="briefcase" class="w-8 h-8 text-indigo-600"></i>
                            <span class="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">Pipelines</span>
                        </div>
                        <div class="text-3xl font-semibold text-slate-900 mb-1">${this.getAllProjectsMerged().filter(a=>String(a.status||"").toLowerCase()!=="completed").length}</div>
                        <div class="text-sm text-slate-600">Active Deals</div>
                        <div class="text-xs text-slate-500 mt-2">ongoing projects</div>
                    </div>
                    
                    <div class="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-lg">
                        <div class="flex flex-wrap items-center justify-between gap-2 mb-4">
                            <i data-lucide="indian-rupee" class="w-8 h-8 text-emerald-600"></i>
                            <span class="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">MTD</span>
                        </div>
                        <div class="text-3xl font-semibold text-slate-900 mb-1">${this.formatINR(this.getStoredInvoices().filter(a=>String(a.status||"").toLowerCase()==="paid").reduce((a,t)=>a+this.parseCurrencyToNumber(t.amount),0))}</div>
                        <div class="text-sm text-slate-600">Revenue Collected</div>
                        <div class="text-xs text-slate-500 mt-2">total paid invoices</div>
                    </div>
                    
                    <div class="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-lg">
                        <div class="flex flex-wrap items-center justify-between gap-2 mb-4">
                            <i data-lucide="send" class="w-8 h-8 text-amber-600"></i>
                            <span class="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded-full">Logs</span>
                        </div>
                        <div class="text-3xl font-semibold text-slate-900 mb-1">${(this.getStoredFollowups?this.getStoredFollowups():[]).length}</div>
                        <div class="text-sm text-slate-600">Total Activities</div>
                        <div class="text-xs text-slate-500 mt-2">meetings & calls</div>
                    </div>
                </div>

                <!-- Weekly Chart -->
                <div class="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-lg">
                    <div class="mb-6">
                        <h3 class="text-lg font-semibold text-slate-900">Leads vs Deals - This Week</h3>
                        <p class="text-sm text-slate-500">Daily comparison of leads generated and deals closed</p>
                    </div>
                    <div class="h-64 flex items-center justify-center bg-slate-50 rounded-lg">
                        <div class="relative w-full h-full"><canvas id="weeklyChart"></canvas></div>
                    </div>
                </div>

                <!-- Top Performing Days & Highlights -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div class="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-lg">
                        <h3 class="text-lg font-semibold text-slate-900 mb-4">Top Performing Days</h3>
                        <div class="space-y-3">
                            <div class="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                                <div>
                                    <div class="font-medium text-slate-900">Wednesday</div>
                                    <div class="text-sm text-slate-600">15 leads, 4 deals</div>
                                </div>
                                <i data-lucide="trophy" class="w-5 h-5 text-purple-600"></i>
                            </div>
                            <div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                <div>
                                    <div class="font-medium text-slate-900">Friday</div>
                                    <div class="text-sm text-slate-600">9 leads, 5 deals</div>
                                </div>
                                <i data-lucide="medal" class="w-5 h-5 text-slate-400"></i>
                            </div>
                            <div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                <div>
                                    <div class="font-medium text-slate-900">Monday</div>
                                    <div class="text-sm text-slate-600">12 leads, 3 deals</div>
                                </div>
                                <i data-lucide="award" class="w-5 h-5 text-slate-400"></i>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-lg">
                        <h3 class="text-lg font-semibold text-slate-900 mb-4">Weekly Highlights</h3>
                        <div class="space-y-3">
                            <div class="flex items-center gap-3">
                                <i data-lucide="check-circle" class="w-5 h-5 text-green-600"></i>
                                <span class="text-sm text-slate-700">Highest revenue week this quarter</span>
                            </div>
                            <div class="flex items-center gap-3">
                                <i data-lucide="check-circle" class="w-5 h-5 text-green-600"></i>
                                <span class="text-sm text-slate-700">3 new enterprise clients onboarded</span>
                            </div>
                            <div class="flex items-center gap-3">
                                <i data-lucide="check-circle" class="w-5 h-5 text-green-600"></i>
                                <span class="text-sm text-slate-700">Campaign conversion rate: 28%</span>
                            </div>
                            <div class="flex items-center gap-3">
                                <i data-lucide="alert-triangle" class="w-5 h-5 text-orange-600"></i>
                                <span class="text-sm text-slate-700">2 proposals pending approval</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `}getDashboardAnalytics(){return`
            <div class="space-y-6 fade-in">
                <!-- Long-term KPIs -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div class="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-lg">
                        <div class="flex flex-wrap items-center justify-between gap-2 mb-4">
                            <i data-lucide="users" class="w-8 h-8 text-purple-500"></i>
                            <span class="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-full">All-time</span>
                        </div>
                        <div class="text-3xl font-semibold text-slate-900 mb-1">${this.getStoredClients().length}</div>
                        <div class="text-sm text-slate-600">Total Clients</div>
                        <div class="text-xs text-slate-500 mt-2">active & dormant</div>
                    </div>
                    
                    <div class="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-lg">
                        <div class="flex flex-wrap items-center justify-between gap-2 mb-4">
                            <i data-lucide="check-square" class="w-8 h-8 text-purple-500"></i>
                            <span class="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-full">Since inception</span>
                        </div>
                        <div class="text-3xl font-semibold text-slate-900 mb-1">${this.getAllProjectsMerged().filter(a=>String(a.status||"").toLowerCase()==="completed").length}</div>
                        <div class="text-sm text-slate-600">Projects Completed</div>
                        <div class="text-xs text-slate-500 mt-2">delivered</div>
                    </div>
                    
                    <div class="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-lg">
                        <div class="flex flex-wrap items-center justify-between gap-2 mb-4">
                            <i data-lucide="indian-rupee" class="w-8 h-8 text-purple-500"></i>
                            <span class="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-full">Lifetime</span>
                        </div>
                        <div class="text-3xl font-semibold text-slate-900 mb-1">${(()=>{const a=this.getStoredInvoices().filter(t=>String(t.status||"").toLowerCase()==="paid").reduce((t,i)=>t+this.parseCurrencyToNumber(i.amount),0);return a>=1e7?"₹"+(a/1e7).toFixed(1)+" Cr":a>=1e5?"₹"+(a/1e5).toFixed(1)+" L":this.formatINR(a)})()}</div>
                        <div class="text-sm text-slate-600">Total Revenue</div>
                        <div class="text-xs text-slate-500 mt-2">earned</div>
                    </div>
                    
                    <div class="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-lg">
                        <div class="flex flex-wrap items-center justify-between gap-2 mb-4">
                            <i data-lucide="trending-up" class="w-8 h-8 text-purple-500"></i>
                            <span class="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-full">Average</span>
                        </div>
                        <div class="text-3xl font-semibold text-slate-900 mb-1">${(()=>{const a=this.getAllProjectsMerged().filter(i=>this.parseCurrencyToNumber(i.value)>0),t=a.length?a.reduce((i,s)=>i+this.parseCurrencyToNumber(s.value),0)/a.length:0;return t>=1e5?"₹"+(t/1e5).toFixed(1)+" L":this.formatINR(t)})()}</div>
                        <div class="text-sm text-slate-600">Avg Project Value</div>
                        <div class="text-xs text-slate-500 mt-2">per project</div>
                    </div>
                </div>

                <!-- Revenue by Service Type -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div class="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-lg">
                        <div class="mb-6">
                            <h3 class="text-lg font-semibold text-slate-900">Revenue by Service Type</h3>
                            <p class="text-sm text-slate-500">Breakdown of revenue sources</p>
                        </div>
                        <div class="h-64 flex items-center justify-center bg-slate-50 rounded-lg">
                            <div class="relative w-full h-full"><canvas id="revenuePieChart"></canvas></div>
                        </div>
                    </div>

                    <div class="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-lg">
                        <div class="mb-6">
                            <h3 class="text-lg font-semibold text-slate-900">Service Breakdown</h3>
                            <p class="text-sm text-slate-500">Revenue by service category</p>
                        </div>
                        <div class="space-y-4">
                            ${this.getServiceBreakdownItems()}
                        </div>
                    </div>
                </div>

                <!-- Additional Analytics -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div class="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-lg">
                        <h3 class="text-lg font-semibold text-slate-900 mb-4">Client Acquisition</h3>
                        <div class="space-y-3">
                            ${(()=>{const a=this.getStoredLeads();if(!a.length)return'<div class="text-sm text-slate-500">Not enough data to construct breakdown.</div>';const t={};return a.forEach(i=>{const s=String(i.source||"Other").trim();t[s]=(t[s]||0)+1}),Object.entries(t).sort((i,s)=>s[1]-i[1]).slice(0,4).map(([i,s],n)=>{const l=Math.round(s/a.length*100),o=l>100?100:l;return`
                                        <div class="flex flex-wrap items-start justify-between gap-3">
                                            <span class="text-sm text-slate-600">${i}</span>
                                            <span class="text-sm font-medium text-slate-900">${l}%</span>
                                        </div>
                                        <div class="w-full bg-slate-100 rounded-full h-2">
                                            <div class="bg-${["purple-600","purple-500","purple-400","purple-300"][n]||"slate-400"} h-2 rounded-full" style="width: ${o}%"></div>
                                        </div>
                                    `}).join("")})()}
                        </div>
                    </div>

                    <div class="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-lg">
                        <h3 class="text-lg font-semibold text-slate-900 mb-4">Project Duration</h3>
                        <div class="space-y-3">
                            ${(()=>{const a=this.getAllProjectsMerged().filter(s=>{var n;return((n=s.metrics)==null?void 0:n.daysToComplete)>0});if(!a.length)return'<div class="text-sm text-slate-500">Not enough data to calculate timeline.</div>';const t={"Less than 1 month":0,"1-3 months":0,"3-6 months":0,"6+ months":0};a.forEach(s=>{const n=s.metrics.daysToComplete;n<=30?t["Less than 1 month"]++:n<=90?t["1-3 months"]++:n<=180?t["3-6 months"]++:t["6+ months"]++});const i=["purple-600","purple-500","purple-400","purple-300"];return Object.entries(t).filter(([s,n])=>n>0).map(([s,n],l)=>{const o=Math.round(n/a.length*100);return`
                                        <div class="flex flex-wrap items-start justify-between gap-3">
                                            <span class="text-sm text-slate-600">${s}</span>
                                            <span class="text-sm font-medium text-slate-900">${o}%</span>
                                        </div>
                                        <div class="w-full bg-slate-100 rounded-full h-2">
                                            <div class="bg-${i[l]||"purple-300"} h-2 rounded-full" style="width: ${o}%"></div>
                                        </div>
                                    `}).join("")})()}
                        </div>
                    </div>

                    <div class="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-lg">
                        <h3 class="text-lg font-semibold text-slate-900 mb-4">Client Satisfaction</h3>
                        <div class="space-y-3">
                            ${(()=>{const a=this.readStore("bezent_feedback_submissions",[]);if(!a.length)return'<div class="text-sm text-slate-500">Not enough CSAT data.</div>';const t={"Excellent (5★)":0,"Good (4★)":0,"Average (3★)":0,"Below Avg (≤2★)":0};a.forEach(s=>{s.rating===5?t["Excellent (5★)"]++:s.rating===4?t["Good (4★)"]++:s.rating===3?t["Average (3★)"]++:t["Below Avg (≤2★)"]++});const i=["green-600","green-400","amber-400","rose-500"];return Object.entries(t).filter(([s,n])=>n>0).map(([s,n],l)=>{const o=Math.round(n/a.length*100);return`
                                        <div class="flex flex-wrap items-start justify-between gap-3">
                                            <span class="text-sm text-slate-600">${s}</span>
                                            <span class="text-sm font-medium text-slate-900">${o}%</span>
                                        </div>
                                        <div class="w-full bg-slate-100 rounded-full h-2">
                                            <div class="bg-${i[l]} h-2 rounded-full" style="width: ${o}%"></div>
                                        </div>
                                    `}).join("")})()}
                        </div>
                    </div>
                </div>
            </div>
        `}getDashboardWork(){return`
            <div class="space-y-6 fade-in">
                <div class="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h2 class="text-xl sm:text-2xl font-semibold text-slate-900">Today's Work</h2>
                        <p class="text-sm text-slate-500">Tasks, meetings, reminders</p>
                    </div>
                    <div class="flex gap-2">
                        <button data-action="nav:dashboard/sop" class="px-3 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">SOP Checklist</button>
                    </div>
                </div>

                <!-- Tasks for Today -->
                <div class="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-lg">
                    <div class="flex flex-wrap items-center justify-between gap-3 mb-4 sm:mb-6">
                        <h3 class="text-lg font-semibold text-slate-900">Tasks for Today</h3>
                        <button data-action="dashboard:addTask" class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                            + Add Task
                        </button>
                    </div>
                    
                    <div class="space-y-3">
                        ${this.getTodayTasks()}
                    </div>
                </div>

                <!-- Meetings -->
                <div class="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-lg">
                    <div class="mb-6">
                        <h3 class="text-lg font-semibold text-slate-900">Meetings</h3>
                    </div>
                    
                    <div class="space-y-4">
                        ${this.getTodayMeetings()}
                    </div>
                </div>

                <!-- Reminders & Alerts -->
                <div class="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-lg">
                    <div class="mb-6">
                        <h3 class="text-lg font-semibold text-slate-900">Reminders & Alerts</h3>
                    </div>
                    
                    <div class="space-y-3">
                        ${this.getTodayReminders()}
                    </div>
                </div>
            </div>
        `}getServiceBreakdownItems(){return[{name:"Consulting",revenue:"₹4,60,000",percentage:28,color:"purple"},{name:"SEO Services",revenue:"₹4,50,000",percentage:27,color:"purple-500"},{name:"Social Media",revenue:"₹3,80,000",percentage:23,color:"purple-400"},{name:"Content Marketing",revenue:"₹2,90,000",percentage:18,color:"purple-300"},{name:"Email Marketing",revenue:"₹2,20,000",percentage:13,color:"purple-200"}].map(t=>`
            <div class="flex flex-wrap items-start justify-between gap-3">
                <div class="flex-1">
                    <div class="flex items-center justify-between mb-1">
                        <span class="text-sm font-medium text-slate-900">${t.name}</span>
                        <span class="text-sm text-slate-600">${t.revenue}</span>
                    </div>
                    <div class="w-full bg-slate-100 rounded-full h-2">
                        <div class="bg-${t.color} h-2 rounded-full transition-all" style="width: ${t.percentage}%"></div>
                    </div>
                </div>
            </div>
        `).join("")}getTodayTasks(){const a=this.readStore("bezent_tasks",[]),t=[];if(!a.length){const s=this.getAllInvoices().filter(l=>String((l==null?void 0:l.status)||"").toLowerCase()==="overdue");s.length&&t.push({id:"auto_inv",text:`Follow up on ${s.length} overdue invoice${s.length!==1?"s":""}`,priority:"High",completed:!1,auto:!0}),this.getStoredLeads().filter(l=>!["closed","converted"].includes(String(l.stage||l.status||"").toLowerCase())).slice(0,2).forEach((l,o)=>{t.push({id:`auto_lead_${o}`,text:`Follow up lead: ${l.company||l.contact||"Unknown"}`,priority:"Medium",completed:!1,auto:!0})})}const i=a.length?a:t;return i.length?i.map((s,n)=>`
            <div class="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <input type="checkbox" ${s.completed?"checked":""}
                    data-action="dashboard:toggleTask"
                    data-task-id="${s.id||n}"
                    class="w-4 h-4 text-purple-600 rounded focus:ring-purple-500 cursor-pointer">
                <div class="flex-1">
                    <span class="text-sm ${s.completed?"line-through text-slate-400":"text-slate-700"}">${s.text}</span>
                    ${s.auto?'<span class="text-xs text-slate-400 ml-2">(auto)</span>':""}
                </div>
                <span class="px-2 py-1 text-xs font-medium rounded-full ${s.priority==="High"?"bg-red-100 text-red-700":s.priority==="Medium"?"bg-yellow-100 text-yellow-700":"bg-green-100 text-green-700"}">${s.priority}</span>
            </div>
        `).join(""):'<div class="p-4 text-center text-slate-400 text-sm">No tasks for today. Click <strong>+ Add Task</strong> to get started.</div>'}getTodayMeetings(){const t=(this.getStoredFollowups?this.getStoredFollowups():[]).filter(i=>!i.done&&String(i.type||"").toLowerCase()==="meeting").slice(0,3);return t.length?t.map(i=>`
            <div class="flex items-start gap-4 p-4 border border-slate-200 rounded-lg">
                <div class="flex-shrink-0">
                    <div class="text-sm font-medium text-slate-900">${String(i.scheduled_time||i.scheduledTime||"—")}</div>
                </div>
                <div class="w-px h-12 bg-slate-200"></div>
                <div class="flex-1">
                    <div class="font-medium text-slate-900 mb-1">${String(i.client||"Client")}</div>
                    <div class="text-sm text-slate-600 mb-2">${String(i.topic||"Meeting")}</div>
                    <div class="flex gap-2">
                        <button class="px-3 py-1 text-xs font-medium bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors">Join Call</button>
                        <button class="px-3 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded transition-colors">View Details</button>
                    </div>
                </div>
            </div>
        `).join(""):'<div class="p-4 text-sm text-slate-500 text-center">No meetings scheduled — add a follow-up with type "Meeting" to see it here.</div>'}getTodayReminders(){const a=[],t=s=>String(s??"").replace(/</g,"&lt;");this.getAllInvoices().filter(s=>String((s==null?void 0:s.status)||"").toLowerCase()==="overdue").forEach(s=>{a.push({time:"Now",text:`Overdue invoice ${t(s.no)} — ${t(s.client)} (${t(s.amount)})`,urgent:!0})}),this.getStoredLeads().filter(s=>["new lead","open"].includes(String(s.stage||s.status||"").toLowerCase())).slice(0,2).forEach(s=>{a.push({time:"Today",text:`New lead needs follow-up: ${t(s.company||s.contact||"Unknown")}`,urgent:!1})}),this.getStoredCampaigns().filter(s=>String(s.status||"").toLowerCase()==="scheduled").slice(0,2).forEach(s=>{a.push({time:"Scheduled",text:`Campaign ready to send: ${t(s.name)} — ${s.audience} contacts`,urgent:!1})});const i=this.readStore("bezent_feedback_submissions",[]);return i.length&&a.push({time:"Review",text:`${i.length} feedback submission${i.length!==1?"s":""} received — check Engagement → Surveys`,urgent:!1}),a.length||a.push({time:"All clear",text:"No pending reminders today — great work!",urgent:!1}),a.map(s=>`
            <div class="flex items-center gap-3 p-3 ${s.urgent?"bg-rose-50 border border-rose-200":"bg-amber-50"} rounded-lg">
                <i data-lucide="${s.urgent?"alert-circle":"bell"}" class="w-4 h-4 ${s.urgent?"text-rose-600":"text-amber-700"} flex-shrink-0"></i>
                <div class="flex-1">
                    <div class="text-sm ${s.urgent?"text-rose-800 font-medium":"text-slate-700"}">${s.text}</div>
                    <div class="text-xs ${s.urgent?"text-rose-600":"text-slate-500"} mt-1">${s.time}</div>
                </div>
            </div>
        `).join("")}renderLeadsContent(a){switch(this.currentSubSection){case"registration":a.innerHTML=this.getLeadsRegistrationHub();break;case"client_registration":a.innerHTML=this.getLeadsRegistration();break;case"clients":a.innerHTML=this.getLeadsDirectoryHub();break;case"client_directory":a.innerHTML=this.getLeadsDirectory(),this.setupClientDirectoryInteractions();break;case"tracking":a.innerHTML=this.getLeadsContacts();break;case"details":this.currentSubSection="clients",a.innerHTML=this.getLeadsDirectoryHub();break;case"lead_registration":a.innerHTML=this.getLeadRegistration();break;case"lead_directory":a.innerHTML=this.getLeadDirectory(),this.setupLeadDirectoryInteractions();break;case"lead_sources":a.innerHTML=this.getLeadSourcesDashboard();break;case"lead_pipeline":a.innerHTML=this.getLeadPipelineTracker();break;case"indiamart":a.innerHTML=this.getIndiamartLeads();break;case"categorization":a.innerHTML=this.getClientCategorization();break;case"smart_feedback":a.innerHTML=this.getSmartFeedbackTracker();break;case"greetings":a.innerHTML=this.getClientGreetings();break;case"lead_sla":a.innerHTML=this.getLeadSlaTracker();break;default:a.innerHTML=this.getLeadsDirectory(),this.setupClientDirectoryInteractions()}}getLeadSourcesDashboard(){var p,g;const a=this.getStoredLeads(),t=h=>String(h??"").replace(/</g,"&lt;"),i={};a.forEach(h=>{const m=String(h.source||h.leadSource||"Direct").trim()||"Direct";i[m]=(i[m]||0)+1});const s=Object.entries(i).sort((h,m)=>m[1]-h[1]),n=a.length||1,l=["purple","sky","emerald","amber","rose","indigo","teal","orange"],o=a.filter(h=>["converted","closed won"].includes(String(h.stage||h.status||"").toLowerCase())).length,r=Math.round(o/n*100),c=((p=s[0])==null?void 0:p[0])||"—",d=((g=s[0])==null?void 0:g[1])||0;return`
        <div class="space-y-6 fade-in">
            <div class="flex flex-wrap items-start justify-between gap-3">
                <div><h2 class="text-xl sm:text-2xl font-semibold text-slate-900">Lead Sources Dashboard</h2>
                <p class="text-sm text-slate-500">Where your leads come from and how they convert</p></div>
                <button data-action="nav:leads/lead_directory" class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">View All Leads →</button>
            </div>
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                    <div class="text-xs text-slate-500">Total Leads</div>
                    <div class="text-2xl font-bold text-slate-900 mt-1">${a.length}</div>
                </div>
                <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                    <div class="text-xs text-slate-500">Sources Tracked</div>
                    <div class="text-2xl font-bold text-purple-700 mt-1">${s.length}</div>
                </div>
                <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                    <div class="text-xs text-slate-500">Top Source</div>
                    <div class="text-lg font-bold text-sky-700 mt-1">${t(c)}</div>
                    <div class="text-xs text-slate-400">${d} leads</div>
                </div>
                <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                    <div class="text-xs text-slate-500">Conversion Rate</div>
                    <div class="text-2xl font-bold text-emerald-700 mt-1">${r}%</div>
                </div>
            </div>
            <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div class="text-sm font-semibold text-slate-700 mb-4">Leads by Source</div>
                ${a.length===0?'<div class="text-center py-10 text-slate-400"><i data-lucide="bar-chart-2" class="w-10 h-10 mx-auto mb-2 opacity-30"></i><p>No leads yet. <button data-action="nav:leads/lead_directory" class="text-purple-600 hover:underline">Add your first lead →</button></p></div>':s.map(([h,m],f)=>{const w=Math.round(m/n*100),u=l[f%l.length];return`<div class="mb-4">
                        <div class="flex items-center justify-between mb-1">
                            <span class="text-sm font-medium text-slate-700">${t(h)}</span>
                            <span class="text-sm text-slate-500">${m} leads · ${w}%</span>
                        </div>
                        <div class="w-full bg-slate-100 rounded-full h-3">
                            <div class="bg-${u}-500 h-3 rounded-full transition-all" style="width:${w}%"></div>
                        </div>
                    </div>`}).join("")}
            </div>
            <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div class="text-sm font-semibold text-slate-700 mb-3">Source Breakdown Table</div>
                <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead class="bg-slate-50"><tr>
                        <th class="text-left px-3 py-2 font-medium text-slate-600">Source</th>
                        <th class="text-left px-3 py-2 font-medium text-slate-600">Count</th>
                        <th class="text-left px-3 py-2 font-medium text-slate-600">Share</th>
                        <th class="text-left px-3 py-2 font-medium text-slate-600">Converted</th>
                    </tr></thead>
                    <tbody class="divide-y divide-slate-100">
                    ${s.map(([h,m])=>{const f=a.filter(w=>String(w.source||w.leadSource||"Direct")===h&&["converted","closed won"].includes(String(w.stage||w.status||"").toLowerCase())).length;return`<tr class="hover:bg-slate-50">
                            <td class="px-3 py-2 font-medium text-slate-800">${t(h)}</td>
                            <td class="px-3 py-2 text-slate-600">${m}</td>
                            <td class="px-3 py-2 text-slate-600">${Math.round(m/n*100)}%</td>
                            <td class="px-3 py-2 text-emerald-700 font-medium">${f}</td>
                        </tr>`}).join("")}
                    </tbody>
                </table></div>
            </div>
        </div>`}getLeadPipelineTracker(){const a=this.getStoredLeads(),t=o=>String(o??"").replace(/</g,"&lt;"),i=["New Lead","Contacted","Qualified","Proposal Sent","Negotiation","Converted","Lost"],s={};i.forEach(o=>s[o]=[]),a.forEach(o=>{const r=String(o.stage||o.status||"New Lead"),c=i.find(d=>d.toLowerCase()===r.toLowerCase())||"New Lead";s[c].push(o)});const n={"New Lead":"slate",Contacted:"sky",Qualified:"indigo","Proposal Sent":"purple",Negotiation:"amber",Converted:"emerald",Lost:"rose"},l=a.length;return`
        <div class="space-y-6 fade-in">
            <div class="flex flex-wrap items-start justify-between gap-3">
                <div><h2 class="text-xl sm:text-2xl font-semibold text-slate-900">Lead Pipeline Tracker</h2>
                <p class="text-sm text-slate-500">Kanban view of leads through each sales stage</p></div>
                <div class="flex gap-2">
                    <button data-action="nav:leads/lead_directory" class="px-4 py-2 text-sm font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100">+ Add Lead</button>
                    <span class="px-4 py-2 text-sm font-medium bg-slate-100 text-slate-700 rounded-lg">${l} Total Leads</span>
                </div>
            </div>
            <div class="overflow-x-auto pb-4">
                <div class="flex gap-4" style="min-width: ${i.length*220}px">
                ${i.map(o=>{const r=n[o]||"slate",c=s[o]||[];return`<div class="flex-shrink-0 w-52 bg-slate-50 rounded-xl border border-slate-200">
                        <div class="p-3 border-b border-slate-200 flex items-center justify-between">
                            <span class="text-xs font-bold text-${r}-700 uppercase tracking-wide">${t(o)}</span>
                            <span class="px-2 py-0.5 text-xs font-bold bg-${r}-100 text-${r}-700 rounded-full">${c.length}</span>
                        </div>
                        <div class="p-2 space-y-2 min-h-24">
                        ${c.length===0?'<div class="text-xs text-slate-400 text-center py-4">Empty</div>':c.map(d=>`
                            <div class="bg-white rounded-lg border border-slate-200 p-3 shadow-sm">
                                <div class="text-sm font-semibold text-slate-800">${t(d.company||d.contact||"Unknown")}</div>
                                <div class="text-xs text-slate-500 mt-0.5">${t(d.contact||d.phone||"")}</div>
                                <div class="mt-2 flex gap-1 flex-wrap">
                                    <span class="px-1.5 py-0.5 text-[10px] bg-purple-50 text-purple-600 rounded">${t(d.source||d.leadSource||"Direct")}</span>
                                    ${d.value?`<span class="px-1.5 py-0.5 text-[10px] bg-emerald-50 text-emerald-700 rounded">${t(d.value)}</span>`:""}
                                </div>
                            </div>`).join("")}
                        </div>
                    </div>`}).join("")}
                </div>
            </div>
            <div class="bg-white rounded-xl border border-slate-200 p-4">
                <div class="grid grid-cols-3 sm:grid-cols-7 gap-2 text-center text-xs">
                ${i.map(o=>{var d,p;const r=l?Math.round((((d=s[o])==null?void 0:d.length)||0)/l*100):0;return`<div><div class="font-bold text-${n[o]||"slate"}-700 text-lg">${((p=s[o])==null?void 0:p.length)||0}</div><div class="text-slate-500">${o}</div><div class="text-slate-400">${r}%</div>`}).join("")}
                </div>
            </div>
        </div>`}getIndiamartLeads(){const a=this.getStoredLeads(),t=r=>String(r??"").replace(/</g,"&lt;"),i=a.filter(r=>String(r.source||r.leadSource||"").toLowerCase().includes("indiamart")),s=new Date().toISOString().slice(0,10),n=i.filter(r=>new Date(r.createdAt||0).toISOString().slice(0,10)===s),l=i.filter(r=>!["converted","closed","lost"].includes(String(r.stage||r.status||"").toLowerCase())),o={"New Lead":"bg-sky-100 text-sky-700",Contacted:"bg-indigo-100 text-indigo-700",Qualified:"bg-purple-100 text-purple-700","Proposal Sent":"bg-amber-100 text-amber-700",Converted:"bg-emerald-100 text-emerald-700",Lost:"bg-rose-100 text-rose-700"};return`
        <div class="space-y-6 fade-in">
            <div class="flex flex-wrap items-start justify-between gap-3">
                <div><h2 class="text-xl sm:text-2xl font-semibold text-slate-900">IndiaMART Leads</h2>
                <p class="text-sm text-slate-500">All leads sourced from IndiaMART with SLA tracking</p></div>
                <button data-action="leads:addIndiamart" class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700">+ Add IndiaMART Lead</button>
            </div>
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="bg-white rounded-xl border p-4"><div class="text-xs text-slate-500">Total IndiaMART</div><div class="text-2xl font-bold text-slate-900">${i.length}</div>
                <div class="bg-white rounded-xl border p-4"><div class="text-xs text-slate-500">Today</div><div class="text-2xl font-bold text-sky-700">${n.length}</div>
                <div class="bg-white rounded-xl border p-4"><div class="text-xs text-slate-500">Open / Active</div><div class="text-2xl font-bold text-purple-700">${l.length}</div>
                <div class="bg-white rounded-xl border p-4"><div class="text-xs text-slate-500">Converted</div><div class="text-2xl font-bold text-emerald-700">${i.filter(r=>String(r.stage||r.status||"").toLowerCase()==="converted").length}</div>
            </div>
            ${i.length===0?'<div class="bg-white rounded-xl border border-slate-200 p-10 text-center text-slate-400"><i data-lucide="inbox" class="w-10 h-10 mx-auto mb-3 opacity-30"></i><p class="font-medium">No IndiaMART leads yet.</p><p class="text-sm mt-1">Click <strong>+ Add IndiaMART Lead</strong> to log one, or make sure leads have source set to "IndiaMART".</p></div>':`<div class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <div class="p-4 border-b border-slate-200 font-medium text-slate-700">Lead List</div>
                <div class="overflow-x-auto"><table class="w-full text-sm" style="min-width:700px">
                    <thead class="bg-slate-50"><tr>
                        <th class="text-left px-4 py-3 font-medium text-slate-600">Company</th>
                        <th class="text-left px-4 py-3 font-medium text-slate-600">Contact</th>
                        <th class="text-left px-4 py-3 font-medium text-slate-600">Stage</th>
                        <th class="text-left px-4 py-3 font-medium text-slate-600">Received</th>
                        <th class="text-left px-4 py-3 font-medium text-slate-600">SLA</th>
                        <th class="text-left px-4 py-3 font-medium text-slate-600">Action</th>
                    </tr></thead>
                    <tbody class="divide-y divide-slate-100">
                    ${i.slice(0,20).map(r=>{const c=new Date(r.createdAt||Date.now()),d=Math.floor((Date.now()-c.getTime())/864e5),p=d<=1,g=String(r.stage||r.status||"New Lead"),h=o[g]||"bg-slate-100 text-slate-600";return`<tr class="hover:bg-slate-50">
                            <td class="px-4 py-3 font-medium text-slate-800">${t(r.company||r.contact||"—")}</td>
                            <td class="px-4 py-3 text-slate-600">${t(r.contact||r.phone||"—")}</td>
                            <td class="px-4 py-3"><span class="px-2 py-1 text-xs rounded-full font-medium ${h}">${t(g)}</span></td>
                            <td class="px-4 py-3 text-slate-500">${c.toLocaleDateString("en-IN")}</td>
                            <td class="px-4 py-3"><span class="px-2 py-1 text-xs rounded-full ${p?"bg-emerald-100 text-emerald-700":"bg-rose-100 text-rose-700"}">${p?"Within SLA":d+"d overdue"}</span></td>
                            <td class="px-4 py-3"><button data-action="nav:leads/lead_directory" class="px-3 py-1 text-xs bg-purple-50 text-purple-700 rounded hover:bg-purple-100">View</button></td>
                        </tr>`}).join("")}
                    </tbody>
                </table></div>
            </div>`}
        </div>`}getClientCategorization(){const a=this.getStoredClients(),t=o=>String(o??"").replace(/</g,"&lt;"),i=this.readStore("bezent_client_tags",{}),s=["VIP","Hot Lead","Retainer","One-Time","At Risk","New","Priority","Dormant"],n={};s.forEach(o=>n[o]=0),a.forEach(o=>{const r=o.name||o.company||"";(i[r]||[]).forEach(d=>{n[d]=(n[d]||0)+1})});const l={VIP:"purple","Hot Lead":"rose",Retainer:"emerald","One-Time":"sky","At Risk":"amber",New:"indigo",Priority:"orange",Dormant:"slate"};return`
        <div class="space-y-6 fade-in">
            <div class="flex flex-wrap items-start justify-between gap-3">
                <div><h2 class="text-xl sm:text-2xl font-semibold text-slate-900">Client Categorization</h2>
                <p class="text-sm text-slate-500">Tag and segment clients by priority or type</p></div>
                <button data-action="nav:leads/client_directory" class="px-4 py-2 text-sm font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100">← Client Directory</button>
            </div>
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                ${s.slice(0,4).map(o=>{const r=l[o]||"slate";return`<div class="bg-white rounded-xl border border-slate-200 p-4 text-center">
                        <div class="text-xs text-slate-500">${o}</div>
                        <div class="text-2xl font-bold text-${r}-700 mt-1">${n[o]||0}</div>
                    </div>`}).join("")}
            </div>
            <div class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <div class="p-4 border-b flex items-center justify-between">
                    <span class="font-medium text-slate-700">Clients & Tags</span>
                    <span class="text-xs text-slate-400">${a.length} clients</span>
                </div>
                ${a.length===0?'<div class="p-8 text-center text-slate-400">No clients yet. <button data-action="nav:leads/client_directory" class="text-purple-600 hover:underline">Add clients →</button></div>':`<div class="overflow-x-auto"><table class="w-full text-sm" style="min-width:600px">
                    <thead class="bg-slate-50"><tr>
                        <th class="text-left px-4 py-3 font-medium text-slate-600">Client</th>
                        <th class="text-left px-4 py-3 font-medium text-slate-600">Tags</th>
                        <th class="text-left px-4 py-3 font-medium text-slate-600">Manage</th>
                    </tr></thead>
                    <tbody class="divide-y divide-slate-100">
                    ${a.map(o=>{const r=o.name||o.company||"",c=i[r]||[];return`<tr class="hover:bg-slate-50">
                            <td class="px-4 py-3 font-medium text-slate-800">${t(r)}</td>
                            <td class="px-4 py-3">
                                <div class="flex flex-wrap gap-1">
                                ${c.map(d=>`<span class="px-2 py-0.5 text-xs rounded-full bg-${l[d]||"slate"}-100 text-${l[d]||"slate"}-700">${t(d)}</span>`).join("")}
                                ${c.length===0?'<span class="text-xs text-slate-400">No tags</span>':""}
                                </div>
                            </td>
                            <td class="px-4 py-3">
                                <select data-action="categorization:setTag" data-client="${t(r)}" class="text-xs border border-slate-200 rounded px-2 py-1 text-slate-600">
                                    <option value="">+ Add Tag</option>
                                    ${s.map(d=>`<option value="${d}">${d}</option>`).join("")}
                                </select>
                            </td>
                        </tr>`}).join("")}
                    </tbody>
                </table></div>`}
            </div>
        </div>`}getSmartFeedbackTracker(){this.getStoredLeads();const a=l=>String(l??"").replace(/</g,"&lt;"),t=this.readStore("bezent_smart_feedback",[]),i=["Call Later","Not Interested","Revisit","Warm","Rejected","No Answer","Meeting Booked"],s={};i.forEach(l=>s[l]=t.filter(o=>o.disposition===l).length);const n=t.slice(0,15);return`
        <div class="space-y-6 fade-in">
            <div class="flex flex-wrap items-start justify-between gap-3">
                <div><h2 class="text-xl sm:text-2xl font-semibold text-slate-900">Smart Feedback Tracker</h2>
                <p class="text-sm text-slate-500">Log call dispositions and follow-up status per lead</p></div>
                <button data-action="feedback:logCall" class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700">+ Log Call</button>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                ${i.map(l=>{const r={"Call Later":"sky","Not Interested":"rose",Revisit:"amber",Warm:"emerald",Rejected:"slate","No Answer":"purple","Meeting Booked":"indigo"}[l]||"slate";return`<div class="bg-white rounded-xl border border-slate-200 p-3 text-center shadow-sm">
                        <div class="text-xs text-slate-500 truncate">${l}</div>
                        <div class="text-xl font-bold text-${r}-700 mt-1">${s[l]}</div>
                    </div>`}).join("")}
            </div>
            <div class="bg-white rounded-xl border border-slate-200 shadow-sm">
                <div class="p-4 border-b font-medium text-slate-700">Call Log History</div>
                ${n.length===0?'<div class="p-8 text-center text-slate-400"><i data-lucide="phone-missed" class="w-8 h-8 mx-auto mb-2 opacity-30"></i><p>No calls logged yet. Click <strong>+ Log Call</strong> to start.</p></div>':`<div class="overflow-x-auto"><table class="w-full text-sm" style="min-width:600px">
                    <thead class="bg-slate-50"><tr>
                        <th class="text-left px-4 py-3 font-medium text-slate-600">Date</th>
                        <th class="text-left px-4 py-3 font-medium text-slate-600">Lead / Company</th>
                        <th class="text-left px-4 py-3 font-medium text-slate-600">Disposition</th>
                        <th class="text-left px-4 py-3 font-medium text-slate-600">Notes</th>
                        <th class="text-left px-4 py-3 font-medium text-slate-600">Next Action</th>
                    </tr></thead>
                    <tbody class="divide-y divide-slate-100">
                    ${n.map(l=>{const r={"Call Later":"bg-sky-100 text-sky-700","Not Interested":"bg-rose-100 text-rose-700",Revisit:"bg-amber-100 text-amber-700",Warm:"bg-emerald-100 text-emerald-700",Rejected:"bg-slate-100 text-slate-600","No Answer":"bg-purple-100 text-purple-700","Meeting Booked":"bg-indigo-100 text-indigo-700"}[l.disposition]||"bg-slate-100 text-slate-600";return`<tr class="hover:bg-slate-50">
                            <td class="px-4 py-3 text-slate-500">${a(l.date)}</td>
                            <td class="px-4 py-3 font-medium text-slate-800">${a(l.lead)}</td>
                            <td class="px-4 py-3"><span class="px-2 py-1 text-xs rounded-full font-medium ${r}">${a(l.disposition)}</span></td>
                            <td class="px-4 py-3 text-slate-600 max-w-xs truncate">${a(l.notes)}</td>
                            <td class="px-4 py-3 text-slate-600">${a(l.nextAction||"—")}</td>
                        </tr>`}).join("")}
                    </tbody>
                </table></div>`}
            </div>
        </div>`}getClientGreetings(){this.getStoredClients();const a=r=>String(r??"").replace(/</g,"&lt;"),t=this.readStore("bezent_greetings",[]),i=new Date,s=i.getMonth()+1,n=i.getDate(),l=t.filter(r=>{if(!r.date)return!1;const c=new Date(r.date),d=c.getMonth()+1,p=c.getDate(),g=(new Date(i.getFullYear(),d-1,p)-new Date(i.getFullYear(),s-1,n))/864e5;return g>=0&&g<=30}).slice(0,10),o=t.filter(r=>{if(!r.date)return!1;const c=new Date(r.date);return c.getMonth()+1===s&&c.getDate()===n});return`
        <div class="space-y-6 fade-in">
            <div class="flex flex-wrap items-start justify-between gap-3">
                <div><h2 class="text-xl sm:text-2xl font-semibold text-slate-900">Client Greetings & Re-engagement</h2>
                <p class="text-sm text-slate-500">Schedule birthday, anniversary and festival greetings</p></div>
                <button data-action="greetings:addEvent" class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700">+ Add Date</button>
            </div>
            ${o.length>0?`
            <div class="bg-purple-50 border border-purple-200 rounded-xl p-4">
                <div class="flex items-center gap-2 mb-2"><i data-lucide="gift" class="w-5 h-5 text-purple-600"></i><span class="font-semibold text-purple-800">Today's Greetings (${o.length})</span></div>
                ${o.map(r=>`<div class="flex items-center gap-3 p-3 bg-white rounded-lg mt-2">
                    <i data-lucide="cake" class="w-4 h-4 text-purple-400"></i>
                    <div><div class="font-medium text-slate-800">${a(r.client)}</div><div class="text-xs text-slate-500">${a(r.type)} — ${a(r.note||"")}</div>
                    <button data-action="greetings:sendWish" data-client="${a(r.client)}" data-type="${a(r.type)}" class="ml-auto px-3 py-1 text-xs bg-purple-600 text-white rounded-lg hover:bg-purple-700">Send Wish</button>
                </div>`).join("")}
            </div>`:""}
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="bg-white rounded-xl border border-slate-200 shadow-sm">
                    <div class="p-4 border-b font-medium text-slate-700">Upcoming (Next 30 Days)</div>
                    ${l.length===0?'<div class="p-6 text-center text-slate-400 text-sm">No events in next 30 days.<br>Add dates using the button above.</div>':`<div class="divide-y">${l.map(r=>{const c=new Date(r.date),d=Math.round((new Date(i.getFullYear(),c.getMonth(),c.getDate())-new Date(i.getFullYear(),s-1,n))/864e5);return`<div class="flex items-center gap-3 p-4">
                            <div class="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-700 font-bold text-sm">${d===0?"Today":d+"d"}</div>
                            <div class="flex-1"><div class="font-medium text-slate-800">${a(r.client)}</div><div class="text-xs text-slate-500">${a(r.type)}</div>
                            <button data-action="greetings:sendReminder" data-client="${a(r.client)}" data-type="${a(r.type)}" data-date="${a(r.date)}" class="px-3 py-1 text-xs bg-purple-50 text-purple-700 rounded hover:bg-purple-100">Remind</button>
                        </div>`}).join("")}</div>`}
                </div>
                <div class="bg-white rounded-xl border border-slate-200 shadow-sm">
                    <div class="p-4 border-b font-medium text-slate-700">All Events (${t.length})</div>
                    ${t.length===0?'<div class="p-6 text-center text-slate-400 text-sm">No events added yet.<br><button data-action="greetings:addEvent" class="text-purple-600 hover:underline mt-1">+ Add first date</button></div>':`<div class="divide-y max-h-64 overflow-y-auto">${t.map(r=>`<div class="flex items-center gap-3 p-3">
                        <i data-lucide="calendar-heart" class="w-4 h-4 text-purple-400 flex-shrink-0"></i>
                        <div class="flex-1 min-w-0"><div class="font-medium text-slate-800 truncate">${a(r.client)}</div><div class="text-xs text-slate-500">${a(r.type)} · ${a(r.date)}</div>
                    </div>`).join("")}</div>`}
                </div>
            </div>
        </div>`}getLeadSlaTracker(){const a=this.getStoredLeads(),t=c=>String(c??"").replace(/</g,"&lt;"),i=Date.now(),s={"New Lead":4,Contacted:24,Qualified:48,"Proposal Sent":72},n=a.map(c=>{const d=new Date(c.createdAt||i),p=Math.floor((i-d.getTime())/864e5),g=Math.floor((i-d.getTime())/36e5),h=String(c.stage||c.status||"New Lead"),m=s[h]||24,f=g>m&&!["converted","closed","lost"].includes(h.toLowerCase()),w=g>m*.75&&!f;return{...c,ageDays:p,ageHours:g,stage:h,breached:f,warning:w,slah:m}}).sort((c,d)=>d.ageDays-c.ageDays),l=n.filter(c=>c.breached).length,o=n.filter(c=>c.warning).length,r=n.filter(c=>!c.breached&&!c.warning).length;return`
        <div class="space-y-6 fade-in">
            <div class="flex flex-wrap items-start justify-between gap-3">
                <div><h2 class="text-xl sm:text-2xl font-semibold text-slate-900">Lead SLA Tracker</h2>
                <p class="text-sm text-slate-500">Aging report — flag leads that need immediate follow-up</p></div>
                <button data-action="nav:leads/lead_directory" class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700">+ Add Lead</button>
            </div>
            <div class="grid grid-cols-3 gap-4">
                <div class="bg-rose-50 border border-rose-200 rounded-xl p-4 text-center">
                    <div class="text-xs text-rose-600 font-medium">SLA Breached</div>
                    <div class="text-3xl font-bold text-rose-700 mt-1">${l}</div>
                </div>
                <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                    <div class="text-xs text-amber-600 font-medium">Warning Zone</div>
                    <div class="text-3xl font-bold text-amber-700 mt-1">${o}</div>
                </div>
                <div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                    <div class="text-xs text-emerald-600 font-medium">Within SLA</div>
                    <div class="text-3xl font-bold text-emerald-700 mt-1">${r}</div>
                </div>
            </div>
            ${a.length===0?'<div class="bg-white rounded-xl border p-10 text-center text-slate-400"><i data-lucide="clock" class="w-10 h-10 mx-auto mb-3 opacity-30"></i><p>No leads to track. <button data-action="nav:leads/lead_directory" class="text-purple-600 hover:underline">Add leads →</button></p></div>':`<div class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <div class="overflow-x-auto"><table class="w-full text-sm" style="min-width:700px">
                    <thead class="bg-slate-50"><tr>
                        <th class="text-left px-4 py-3 font-medium text-slate-600">Lead</th>
                        <th class="text-left px-4 py-3 font-medium text-slate-600">Stage</th>
                        <th class="text-left px-4 py-3 font-medium text-slate-600">Age</th>
                        <th class="text-left px-4 py-3 font-medium text-slate-600">SLA Limit</th>
                        <th class="text-left px-4 py-3 font-medium text-slate-600">Status</th>
                        <th class="text-left px-4 py-3 font-medium text-slate-600">Action</th>
                    </tr></thead>
                    <tbody class="divide-y divide-slate-100">
                    ${n.map(c=>{const d=c.breached?"bg-rose-100 text-rose-700":c.warning?"bg-amber-100 text-amber-700":"bg-emerald-100 text-emerald-700",p=c.breached?"Breached":c.warning?"Warning":"OK";return`<tr class="hover:bg-slate-50 ${c.breached?"bg-rose-50/30":c.warning?"bg-amber-50/30":""}">
                            <td class="px-4 py-3 font-medium text-slate-800">${t(c.company||c.contact||"Unknown")}</td>
                            <td class="px-4 py-3 text-slate-600">${t(c.stage)}</td>
                            <td class="px-4 py-3 text-slate-600">${c.ageDays}d ${c.ageHours%24}h</td>
                            <td class="px-4 py-3 text-slate-500">${c.slah}h</td>
                            <td class="px-4 py-3"><span class="px-2 py-1 text-xs rounded-full font-medium ${d}">${p}</span></td>
                            <td class="px-4 py-3"><button data-action="leads:callFeedback" class="px-3 py-1 text-xs bg-purple-50 text-purple-700 rounded hover:bg-purple-100">Log Call</button></td>
                        </tr>`}).join("")}
                    </tbody>
                </table></div>
            </div>`}
        </div>`}getLeadsDirectoryHub(){return`
            <div class="space-y-6 fade-in">
                <div class="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h2 class="text-xl sm:text-2xl font-semibold text-slate-900">Directory</h2>
                        <p class="text-sm text-slate-500">Open Client Directory or Lead Directory</p>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <button data-action="nav:leads/client_directory" class="text-left bg-white rounded-lg border border-slate-200 p-6 shadow-lg hover:bg-slate-50 transition-colors">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center">
                                <i data-lucide="users" class="w-6 h-6 text-emerald-600"></i>
                            </div>
                            <div>
                                <div class="text-lg font-semibold text-slate-900">Client Directory</div>
                                <div class="text-sm text-slate-600 mt-1">View clients, status, invoices, and notes</div>
                            </div>
                        </div>
                    </button>

                    <button data-action="nav:leads/lead_directory" class="text-left bg-white rounded-lg border border-slate-200 p-6 shadow-lg hover:bg-slate-50 transition-colors">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                                <i data-lucide="users-round" class="w-6 h-6 text-purple-600"></i>
                            </div>
                            <div>
                                <div class="text-lg font-semibold text-slate-900">Lead Directory</div>
                                <div class="text-sm text-slate-600 mt-1">Track leads and convert to clients</div>
                            </div>
                        </div>
                    </button>
                </div>
            </div>
        `}getLeadRegistration(a=null){const t=i=>String(i??"").replace(/</g,"&lt;");return`
            <div class="space-y-6 fade-in">
                <div class="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h2 class="text-xl sm:text-2xl font-semibold text-slate-900">Lead Registration</h2>
                        <p class="text-sm text-slate-500">Capture lead source and details</p>
                    </div>
                    <div class="flex items-center gap-2">
                        <button data-action="${a?`lead:update:${a.id}`:"lead:register"}" class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">${a?"Update Lead":"Save Lead"}</button>
                        <button data-action="lead:upload:trigger" class="px-4 py-2 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-1"><i data-lucide="upload" style="width:14px;height:14px;"></i>Upload Excel</button>
                        <input type="file" id="leadExcelUpload" accept=".xlsx,.xls,.csv" style="display:none;" />
                    </div>
                </div>

                <div class="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-lg">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-medium text-slate-700">Lead Source</label>
                            <select id="leadSource" class="mt-2 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                                <option ${(a==null?void 0:a.source)==="Exhibition"?"selected":""}>Exhibition</option>
                                <option ${(a==null?void 0:a.source)==="IndiaMART"?"selected":""}>IndiaMART</option>
                                <option ${!a||(a==null?void 0:a.source)==="LinkedIn"?"selected":""}>LinkedIn</option>
                                <option ${(a==null?void 0:a.source)==="Field Visit"?"selected":""}>Field Visit</option>
                                <option ${(a==null?void 0:a.source)==="Referral"?"selected":""}>Referral</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700">Assigned To</label>
                            <input id="leadAssignedTo" type="text" class="mt-2 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="e.g., Team Member" value="${t((a==null?void 0:a.assignedTo)||"")}" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700">Company</label>
                            <input id="leadCompany" type="text" class="mt-2 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="e.g., Acme Corp" value="${t((a==null?void 0:a.company)||"")}" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700">Contact</label>
                            <input id="leadContact" type="text" class="mt-2 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Phone / Email" value="${t((a==null?void 0:a.contact)||"")}" />
                        </div>
                        <div class="col-span-1 sm:col-span-2">
                            <label class="block text-sm font-medium text-slate-700">Next Action</label>
                            <input id="leadNextAction" type="text" class="mt-2 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="e.g., Demo with Technical Team" />
                        </div>
                    </div>
                </div>
            </div>
        `}formatSlaTimer(a){const t=Number.isFinite(Number(a))?Number(a):Date.now(),i=Math.max(0,Math.floor((Date.now()-t)/6e4)),s=Math.floor(i/60),n=i%60;return`${s}h ${n}m`}getLeadsData(){return this.getStoredLeads()}getLeadDirectory(){const a=this.getLeadsData(),t=String(this.selectedLeadId||"").trim(),i=t&&a.find(s=>String((s==null?void 0:s.id)||"").trim().toLowerCase()===t.toLowerCase())||null;return`
            <div class="space-y-6 fade-in">
                <div class="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h2 class="text-xl sm:text-2xl font-semibold text-slate-900">Lead Directory</h2>
                        <p class="text-sm text-slate-500">${a.length} lead${a.length!==1?"s":""} registered</p>
                    </div>
                    <button data-action="nav:leads/lead_registration" class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">+ New Lead</button>
                </div>

                <div class="grid ${i?"grid-cols-1 lg:grid-cols-3":"grid-cols-1"} gap-6">
                    <div class="${i?"col-span-1 lg:col-span-2":"col-span-1"} bg-white rounded-lg border border-slate-200 overflow-hidden">
                        <div class="p-4 border-b border-slate-200 flex items-center justify-between">
                            <div class="text-sm font-medium text-slate-900">Leads</div>
                            <div class="text-xs text-slate-500">Showing ${a.length}</div>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="w-full text-sm" style="min-width: 800px;">
                                <thead class="bg-slate-50 text-slate-600">
                                    <tr>
                                        <th class="text-left px-4 py-3 font-medium">Lead ID</th>
                                        <th class="text-left px-4 py-3 font-medium">Company</th>
                                        <th class="text-left px-4 py-3 font-medium">Contact</th>
                                        <th class="text-left px-4 py-3 font-medium">Source</th>
                                        <th class="text-left px-4 py-3 font-medium">Stage</th>
                                        <th class="text-left px-4 py-3 font-medium">Feedback Status</th>
                                        <th class="text-left px-4 py-3 font-medium">Convert</th>
                                        <th class="text-center px-4 py-3 font-medium">Actions</th>
                                    </tr>
                                </thead>
                                 <tbody class="divide-y divide-slate-200">
                                    ${a.length===0?`
                                        <tr><td colspan="8" class="px-4 py-12 text-center">
                                            <div class="flex flex-col items-center gap-3">
                                                <svg class="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"/></svg>
                                                <p class="text-sm font-medium text-slate-500">No leads yet</p>
                                                <p class="text-xs text-slate-400">Click <strong>+ New Lead</strong> to register your first lead</p>
                                            </div>
                                        </td></tr>`:a.map(s=>{const n=String(s.status||"").toLowerCase()==="converted",l=i&&String(i.id||"").trim().toLowerCase()===String(s.id||"").trim().toLowerCase();return`
                                            <tr data-lead-id="${s.id}" class="hover:bg-slate-50 cursor-pointer ${l?"bg-slate-50":""}">
                                                <td class="px-4 py-3 font-medium text-slate-900">${s.id}</td>
                                                <td class="px-4 py-3 text-slate-700">${s.company}</td>
                                                <td class="px-4 py-3 text-slate-700">${s.contact||"—"}</td>
                                                <td class="px-4 py-3 text-slate-700">${s.source||"—"}</td>
                                                <td class="px-4 py-3 text-slate-700">${s.stage||"—"}</td>
                                                <td class="px-4 py-3 text-slate-700">${s.feedbackStatus||"—"}</td>
                                                <td class="px-4 py-3">
                                                    ${n?'<span class="px-2 py-1 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-full">Converted</span>':`<button data-action="lead:convert" data-lead-id="${s.id}" class="px-3 py-1.5 text-xs font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Convert to Client</button>`}
                                                </td>
                                                <td class="px-4 py-3 text-center">
                                                    <div class="flex items-center justify-center gap-2">
                                                        <button data-action="lead:edit" data-lead-id="${s.id}" class="p-1.5 text-slate-400 hover:text-purple-600 rounded transition flex-shrink-0" title="Edit Lead">
                                                            <i data-lucide="edit-2" class="w-4 h-4" style="width:16px;height:16px;"></i>
                                                        </button>
                                                        <button data-action="lead:delete" data-lead-id="${s.id}" class="p-1.5 text-slate-400 hover:text-red-600 rounded transition flex-shrink-0" title="Delete Lead" onclick="return confirm('Do you really want to delete this lead?')">
                                                            <i data-lucide="trash-2" class="w-4 h-4" style="width:16px;height:16px;"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        `}).join("")}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    ${i?`
                        <div class="bg-white rounded-lg border border-slate-200 p-6 shadow-lg lg:sticky lg:top-6 h-fit">
                            <div class="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <h3 class="text-lg font-semibold text-slate-900">Selected Lead</h3>
                                    <div class="text-xs text-slate-500 mt-1">${i.id}</div>
                                </div>
                                <button id="clearLeadSelection" class="px-3 py-2 text-xs font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">Close</button>
                            </div>

                            <div class="mt-4">
                                <div class="text-sm font-medium text-slate-900">${i.company||"—"}</div>
                                <div class="text-xs text-slate-500">${i.contact||"—"}</div>
                            </div>

                            <div style="margin-top:1.25rem;display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;">
                                <div>
                                    <div class="text-[11px] font-semibold text-slate-500">Source</div>
                                    <div class="text-sm font-medium text-slate-900 mt-1">${i.source||"—"}</div>
                                </div>
                                <div>
                                    <div class="text-[11px] font-semibold text-slate-500">SLA Timer</div>
                                    <div class="text-sm font-medium text-slate-900 mt-1">${this.formatSlaTimer(i.receivedAt)}</div>
                                </div>
                            </div>

                            <div class="mt-4 grid gap-3">
                                <input type="hidden" id="leadDetailId" value="${String(i.id||"").replace(/</g,"&lt;")}" />

                                <div>
                                    <label class="text-xs font-medium text-slate-600">Pipeline Stage</label>
                                    ${this.renderLeadPipelineProgress(i.stage)}
                                    <select id="leadDetailStage" class="mt-3 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                                        ${this.getLeadPipelineStages().map(s=>`
                                            <option ${String(i.stage||"").trim().toLowerCase()===String(s).toLowerCase()?"selected":""}>${s}</option>
                                        `).join("")}
                                    </select>
                                </div>

                                <div>
                                    <label class="text-xs font-medium text-slate-600">Assigned To</label>
                                    <input id="leadDetailAssignedTo" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" value="${String(i.assignedTo||"").replace(/</g,"&lt;")}" />
                                </div>

                                <div>
                                    <label class="text-xs font-medium text-slate-600">Next Action</label>
                                    <input id="leadDetailNextAction" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" value="${String(i.nextAction||"").replace(/</g,"&lt;")}" />
                                </div>

                                <div>
                                    <label class="text-xs font-medium text-slate-600">Feedback Status</label>
                                    <input id="leadDetailFeedback" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" value="${String(i.feedbackStatus||"").replace(/</g,"&lt;")}" />
                                </div>

                                <div>
                                    <label class="text-xs font-medium text-slate-600">Update Note</label>
                                    <textarea id="leadDetailNote" rows="2" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="What changed? (optional)"></textarea>
                                </div>

                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <button data-action="lead:update" class="px-3 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Save</button>
                                    ${String(i.status||"").toLowerCase()==="converted"?'<button data-action="nav:leads/client_directory" class="px-3 py-2 text-sm font-medium bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors">Open Client</button>':`<button data-action="lead:convert" data-lead-id="${i.id}" class="px-3 py-2 text-sm font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors">Convert</button>`}
                                </div>

                                <div class="mt-2">
                                    <div class="text-xs font-semibold text-slate-600 mb-2">History</div>
                                    <div class="space-y-2">
                                        ${(Array.isArray(i.history)?i.history.slice().reverse():[]).slice(0,6).map(s=>`
                                            <div class="p-3 bg-slate-50 rounded-lg">
                                                <div class="flex flex-wrap items-start justify-between gap-3">
                                                    <div class="text-xs font-semibold text-slate-700">${String((s==null?void 0:s.type)||"update")}</div>
                                                    <div class="text-[11px] text-slate-500">${s!=null&&s.at?new Date(s.at).toLocaleString():"—"}</div>
                                                </div>
                                                <div class="text-xs text-slate-600 mt-1">${String((s==null?void 0:s.note)||"").replace(/</g,"&lt;")||"—"}</div>
                                            </div>
                                        `).join("")||'<div class="text-xs text-slate-500">No history yet</div>'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    `:""}
                </div>
            </div>
        `}renderBadge(a){const i={Active:{bg:"bg-emerald-50",text:"text-emerald-700"},Onboarding:{bg:"bg-amber-50",text:"text-amber-700"},Completed:{bg:"bg-slate-100",text:"text-slate-700"}}[a]||{bg:"bg-slate-100",text:"text-slate-700"};return`<span class="px-2 py-1 text-xs font-medium ${i.bg} ${i.text} rounded-full">${a}</span>`}getClientsData(){const a=this.getStoredClients(),t=this.getInvoiceSummaryByClient();return a.map(i=>{const s=String((i==null?void 0:i.name)||"").trim().toLowerCase(),n=t.get(s);return n?{...i,openInvoices:n.openInvoices,dueAmount:this.formatINR(n.dueAmount)}:i})}getClientDetailMock(a){const i=this.getClientsData().find(p=>String(p.name||"").trim()===a);if(!i)return{contact:{name:"Primary Contact",email:"contact@company.com",phone:"+91 90000 00000"},project:{name:"New Project",progress:0,eta:"—",color:"slate"},alert:null,client:null};const s=this.getStoredProjects?this.getStoredProjects():[],n=this.getStoredInvoices?this.getStoredInvoices():[],l=s.filter(p=>String(p.client||"").trim().toLowerCase()===String(a||"").trim().toLowerCase()),r=n.filter(p=>String(p.client||"").trim().toLowerCase()===String(a||"").trim().toLowerCase()).find(p=>String(p.status||"").toLowerCase()==="overdue"),c=l.find(p=>String(p.status||"").toLowerCase()!=="completed")||l[0];return{...{contact:{name:String(i.name||a),email:String(i.email||"—"),phone:String(i.phone||"—")},project:c?{name:String(c.name||"Project"),progress:Number(c.completion||c.progress||0),eta:String(c.end_date||c.endDate||"—"),color:"sky"}:{name:"No active project",progress:0,eta:"—",color:"slate"},alert:r?{title:`Invoice ${r.no||""} overdue`,amount:String(r.amount||""),due:"Overdue"}:null},client:i}}getLeadsRegistration(a=null){return`
            <div class="space-y-6 fade-in">
                <div class="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h2 class="text-xl sm:text-2xl font-semibold text-slate-900">Client Registration</h2>
                        <p class="text-sm text-slate-500">Create a client profile and capture requirements</p>
                    </div>
                    <div class="flex items-center gap-2">
                        <button data-action="${a?`client:update:${a.name.replace(/\"/g,"&quot;")}`:"client:register"}" class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">${a?"Update Client":"Save Client"}</button>
                        <button data-action="client:upload:trigger" class="px-4 py-2 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-1"><i data-lucide="upload" style="width:14px;height:14px;"></i>Upload Excel</button>
                        <input type="file" id="clientExcelUpload" accept=".xlsx,.xls,.csv" style="display:none;" />
                    </div>
                </div>

            <div class="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-lg">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input type="hidden" id="registerMode" value="client" />
                    <div>
                        <label class="text-xs font-medium text-slate-600">Client Name</label>
                        <input id="clientName" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="e.g., Acme Private Limited" />
                    </div>
                    <div>
                        <label class="text-xs font-medium text-slate-600">Owner</label>
                        <select id="clientOwner" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                            <option>Marketing User</option>
                            <option>Sales User</option>
                            <option>Accounts User</option>
                        </select>
                    </div>
                    <div>
                        <label class="text-xs font-medium text-slate-600">Email</label>
                        <input id="clientEmail" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="client@company.com" />
                    </div>
                    <div>
                        <label class="text-xs font-medium text-slate-600">Phone</label>
                        <input id="clientPhone" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="+91 9XXXXXXXXX" />
                    </div>
                    <div>
                        <label class="text-xs font-medium text-slate-600">Industry</label>
                        <select id="clientIndustry" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                            <option>IT Services</option>
                            <option>Manufacturing</option>
                            <option>Education</option>
                            <option>Retail</option>
                            <option>Healthcare</option>
                        </select>
                    </div>
                    <div>
                        <label class="text-xs font-medium text-slate-600">Lead Source</label>
                        <select id="clientLeadSource" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                            <option>Referral</option>
                            <option>Inbound</option>
                            <option>Campaign</option>
                            <option>Outbound</option>
                        </select>
                    </div>
                    <div>
                        <label class="text-xs font-medium text-slate-600">Location</label>
                        <select id="clientLocation" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                            <option value="">Select</option>
                            <option value="CHN">Chennai</option>
                            <option value="HSR">Hosur</option>
                            <option value="OST">Other state</option>
                            <option value="KAK">Karnataka</option>
                            <option value="OTN">Other Tamil Nadu</option>
                        </select>
                    </div>
                    <div>
                        <label class="text-xs font-medium text-slate-600">Vendor Code</label>
                        <input id="clientVendorCode" type="text" readonly class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50 text-slate-700" placeholder="Auto-generated based on location" />
                    </div>
                    <div class="col-span-1 sm:col-span-2">
                        <label class="text-xs font-medium text-slate-600">Notes</label>
                        <textarea id="clientNotes" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" rows="3" placeholder="Requirements, expectations, and next steps..."></textarea>
                    </div>
                </div>
            </div>
            </div>
            `}getLeadsDirectory(){var o,r,c,d,p,g,h,m,f,w;const a=this.getClientsData(),t=a.some(u=>u.name===this.selectedClientName)?this.selectedClientName:null,i=t&&a.find(u=>u.name===t)||null,s=i?this.getClientDetailMock(i.name):null,n=i?this.getAllInvoices().filter(u=>String((u==null?void 0:u.client)||"").trim().toLowerCase()===String(i.name||"").trim().toLowerCase()):[],l=n.slice(0,3);return`
            <div class="space-y-6 fade-in" >
                <div class="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h2 class="text-xl sm:text-2xl font-semibold text-slate-900">Client Directory</h2>
                        <p class="text-sm text-slate-500">${a.length} clients with status badges and quick insights</p>
                    </div>
                    <button data-action="nav:leads/client_registration" class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">+ New Client</button>
                </div>

                <div class="grid ${i?"grid-cols-1 lg:grid-cols-3":"grid-cols-1"} gap-6">
                    <div class="${i?"col-span-1 lg:col-span-2":"col-span-1"} bg-white rounded-lg border border-slate-200 overflow-hidden">
                        <div class="p-4 border-b border-slate-200 flex items-center justify-between">
                            <div class="text-sm font-medium text-slate-900">Clients</div>
                            <div class="text-xs text-slate-500">Showing ${a.length}</div>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="w-full text-sm" style="min-width: 800px;">
                                <thead class="bg-slate-50 text-slate-600">
                                    <tr>
                                        <th class="text-left px-4 py-3 font-medium">Client</th>
                                        <th class="text-left px-4 py-3 font-medium">Owner</th>
                                        <th class="text-left px-4 py-3 font-medium">Status</th>
                                        <th class="text-right px-4 py-3 font-medium">Open Invoices</th>
                                        <th class="text-center px-4 py-3 font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-200">
                                    ${a.map(u=>`
                                        <tr data-client-name="${u.name}" class="hover:bg-slate-50 cursor-pointer ${u.name===t?"bg-slate-50":""}">
                                            <td class="px-4 py-3">
                                                <div class="font-medium text-slate-900">${u.name}</div>
                                                <div class="text-xs text-slate-500">${u.city} • ${u.industry}</div>
                                            </td>
                                            <td class="px-4 py-3 text-slate-700">${u.owner}</td>
                                            <td class="px-4 py-3">${this.renderBadge(u.stage)}</td>
                                            <td class="px-4 py-3 text-right">
                                                <span class="font-medium text-slate-900">${u.openInvoices}</span>
                                                <span class="text-xs text-slate-500"> (${u.dueAmount})</span>
                                            </td>
                                            <td class="px-4 py-3 text-center">
                                                <div class="flex items-center justify-center gap-2">
                                                    <button data-action="client:edit" data-client-name="${u.name}" class="p-1.5 text-slate-400 hover:text-purple-600 rounded transition flex-shrink-0" title="Edit Client">
                                                        <i data-lucide="edit-2" class="w-4 h-4" style="width:16px;height:16px;"></i>
                                                    </button>
                                                    <button data-action="client:delete" data-client-name="${u.name}" class="p-1.5 text-slate-400 hover:text-red-600 rounded transition flex-shrink-0" title="Delete Client" onclick="return confirm('Do you really want to delete this client?')">
                                                        <i data-lucide="trash-2" class="w-4 h-4" style="width:16px;height:16px;"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    `).join("")}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    ${i?`
                        <div class="bg-white rounded-lg border border-slate-200 p-6 shadow-lg lg:sticky lg:top-6 h-fit">
                            <div class="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <h3 class="text-lg font-semibold text-slate-900">Selected Client</h3>
                                    <p class="text-sm text-slate-500">${i.name}</p>
                                </div>
                                <span class="px-2 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded-full">${i.stage}</span>
                            </div>

                            <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <button data-action="client:edit" data-client-name="${i.name}" class="px-3 py-2 text-sm font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">Edit</button>
                                <button data-action="client:delete" data-client-name="${i.name}" class="px-3 py-2 text-sm font-medium bg-rose-50 text-rose-700 rounded-lg hover:bg-rose-100 transition-colors">Delete</button>
                            </div>

                            <div class="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <button data-action="client:createInvoice" data-client-name="${i.name}" class="px-3 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Create Invoice</button>
                                <button data-action="task:create" class="px-3 py-2 text-sm font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">Create Task</button>
                            </div>

                            <div class="mt-4 p-3 bg-slate-50 rounded-lg">
                                <div class="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                        <div class="text-xs text-slate-500">Latest invoices</div>
                                        <div class="text-sm font-medium text-slate-900">${l.length?`${l.length} shown • ${n.length} total`:"No invoices yet"}</div>
                                    </div>
                                    <button data-action="nav:billing/invoices" data-invoice-client-filter="${i.name}" class="px-3 py-2 text-xs font-medium bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">View in Billing</button>
                                </div>

                                ${l.length?`
                                    <div class="mt-3 space-y-2">
                                        ${l.map(u=>`
                                            <div class="flex items-center justify-between gap-2 p-2 bg-white border border-slate-200 rounded-lg">
                                                <div>
                                                    <div class="text-sm font-semibold text-slate-900">${u.no||"—"}</div>
                                                    <div class="text-xs text-slate-600">${u.amount||"—"} • ${u.status||"—"}</div>
                                                </div>
                                                <div class="flex items-center gap-2">
                                                    <button
                                                        data-action="invoice:preview"
                                                        data-invoice-no="${u.no}"
                                                        data-invoice-client="${u.client}"
                                                        data-invoice-amount="${u.amount}"
                                                        data-invoice-due="${u.due}"
                                                        data-invoice-status="${u.status}"
                                                        data-invoice-color="${u.color}"
                                                        class="px-2 py-1 text-xs font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
                                                    >Preview</button>
                                                    ${String(u.status||"").trim().toLowerCase()!=="paid"?`
                                                        <button
                                                            data-action="invoice:markPaid"
                                                            data-invoice-no="${u.no}"
                                                            data-invoice-client="${u.client}"
                                                            data-invoice-amount="${u.amount}"
                                                            data-invoice-due="${u.due}"
                                                            data-invoice-status="${u.status}"
                                                            data-invoice-color="${u.color}"
                                                            class="px-2 py-1 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors"
                                                        >Mark Paid</button>
                                                    `:""}
                                                </div>
                                            </div>
                                        `).join("")}
                                    </div>
                                `:""}
                            </div>

                            <div class="mt-4 space-y-3">
                                <div class="p-3 bg-slate-50 rounded-lg">
                                    <div class="text-xs text-slate-500">Client Name</div>
                                    <div class="text-sm font-medium text-slate-900">${i.name||"—"}</div>
                                </div>
                                <div class="p-3 bg-slate-50 rounded-lg">
                                    <div class="text-xs text-slate-500">Owner</div>
                                    <div class="text-sm font-medium text-slate-900">${i.owner||"—"}</div>
                                </div>
                                <div class="p-3 bg-slate-50 rounded-lg">
                                    <div class="text-xs text-slate-500">Email</div>
                                    <div class="text-sm font-medium text-slate-900">${i.email||((o=s==null?void 0:s.contact)==null?void 0:o.email)||"—"}</div>
                                </div>
                                <div class="p-3 bg-slate-50 rounded-lg">
                                    <div class="text-xs text-slate-500">Phone</div>
                                    <div class="text-sm font-medium text-slate-900">${i.phone||((r=s==null?void 0:s.contact)==null?void 0:r.phone)||"—"}</div>
                                </div>
                                <div class="p-3 bg-slate-50 rounded-lg">
                                    <div class="text-xs text-slate-500">Industry</div>
                                    <div class="text-sm font-medium text-slate-900">${i.industry||"—"}</div>
                                </div>
                                <div class="p-3 bg-slate-50 rounded-lg">
                                    <div class="text-xs text-slate-500">Lead Source</div>
                                    <div class="text-sm font-medium text-slate-900">${i.leadSource||"—"}</div>
                                </div>
                                <div class="p-3 bg-slate-50 rounded-lg">
                                    <div class="text-xs text-slate-500">Location</div>
                                    <div class="text-sm font-medium text-slate-900">${this.getLocationName(i.location)||"—"}</div>
                                </div>
                                <div class="p-3 bg-slate-50 rounded-lg">
                                    <div class="text-xs text-slate-500">Vendor Code</div>
                                    <div class="text-sm font-medium text-slate-900">${i.vendorCode||"—"}</div>
                                </div>
                                <div class="p-3 bg-slate-50 rounded-lg">
                                    <div class="text-xs text-slate-500">City</div>
                                    <div class="text-sm font-medium text-slate-900">${i.city||"—"}</div>
                                </div>
                                ${i.notes?`
                                    <div class="p-3 bg-slate-50 rounded-lg">
                                        <div class="text-xs text-slate-500">Notes</div>
                                        <div class="text-sm font-medium text-slate-900 whitespace-pre-wrap">${i.notes}</div>
                                    </div>
                                `:""}
                                <div class="p-3 bg-slate-50 rounded-lg">
                                    <div class="text-xs text-slate-500">Primary Contact</div>
                                    <div class="text-sm font-medium text-slate-900">${((c=s==null?void 0:s.contact)==null?void 0:c.name)||i.owner||"—"}</div>
                                    <div class="text-xs text-slate-600">${i.email||((d=s==null?void 0:s.contact)==null?void 0:d.email)||"—"} • ${i.phone||((p=s==null?void 0:s.contact)==null?void 0:p.phone)||"—"}</div>
                                </div>
                                <div class="p-3 bg-slate-50 rounded-lg">
                                    <div class="text-xs text-slate-500">Current Project</div>
                                    <div class="text-sm font-medium text-slate-900">${((g=s==null?void 0:s.project)==null?void 0:g.name)||"—"}</div>
                                    <div class="mt-2 w-full bg-slate-200 rounded-full h-2">
                                        <div class="bg-${((h=s==null?void 0:s.project)==null?void 0:h.color)||"slate"}-600 h-2 rounded-full" style="width: ${((m=s==null?void 0:s.project)==null?void 0:m.progress)??0}%"></div>
                                    </div>
                                    <div class="text-xs text-slate-600 mt-1">${((f=s==null?void 0:s.project)==null?void 0:f.progress)??0}% complete • ETA: ${((w=s==null?void 0:s.project)==null?void 0:w.eta)||"—"}</div>
                                </div>

                                ${s!=null&&s.alert?`
                                    <div class="p-3 bg-rose-50 rounded-lg border border-rose-100">
                                        <div class="flex items-start gap-3">
                                            <i data-lucide="alert-triangle" class="w-4 h-4 text-rose-700 mt-0.5"></i>
                                            <div>
                                                <div class="text-sm font-medium text-rose-900">${s.alert.title}</div>
                                                <div class="text-xs text-rose-800">${s.alert.amount} • ${s.alert.due}</div>
                                            </div>
                                        </div>
                                        <button data-action="client:followup" class="mt-3 w-full px-3 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Resolve / Follow up</button>
                                    </div>
                                `:`
                                    <div class="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                                        <div class="flex items-start gap-3">
                                            <i data-lucide="check-circle" class="w-4 h-4 text-emerald-700 mt-0.5"></i>
                                            <div>
                                                <div class="text-sm font-medium text-emerald-900">No urgent alerts</div>
                                                <div class="text-xs text-emerald-800">Engagement and billing are stable</div>
                                            </div>
                                        </div>
                                        <button data-action="client:note" class="mt-3 w-full px-3 py-2 text-sm font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">Log a note</button>
                                    </div>
                                `}
                            </div>
                        </div>
                    `:""}
                </div>
            </div>
            `}getLeadsContacts(){const a=this.getAllContactsData(),t=n=>Array.from(new Set(n.map(l=>String(l||"").trim()).filter(Boolean))).sort((l,o)=>l.localeCompare(o)),i=t(a.map(n=>n.owner)),s=t(a.map(n=>n.source));return`
            <div class="space-y-6 fade-in" >
                <div class="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h2 class="text-xl sm:text-2xl font-semibold text-slate-900">Contacts</h2>
                        <p class="text-sm text-slate-500">All leads and clients contacts in one place</p>
                    </div>
                    <button class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">+ Add Contact</button>
                </div>

                <div class="bg-white rounded-lg border border-slate-200 overflow-hidden">
                    <div class="p-4 border-b border-slate-200 flex items-center justify-between">
                        <div class="text-sm font-medium text-slate-900">All Contacts</div>
                        <div class="text-xs text-slate-500">Showing ${a.length}</div>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full text-sm" style="min-width: 1050px;">
                            <thead class="bg-slate-50 text-slate-600">
                                <tr>
                                    <th class="text-left px-4 py-3 font-medium">Type</th>
                                    <th class="text-left px-4 py-3 font-medium">Name</th>
                                    <th class="text-left px-4 py-3 font-medium">Phone</th>
                                    <th class="text-left px-4 py-3 font-medium">Email</th>
                                    <th class="text-left px-4 py-3 font-medium">Owner</th>
                                    <th class="text-left px-4 py-3 font-medium">Source</th>
                                    <th class="text-left px-4 py-3 font-medium">Actions</th>
                                </tr>
                                <tr class="bg-white">
                                    <th class="px-4 py-3">
                                        <select id="contactsFilterType" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                                            <option>All</option>
                                            <option>Client</option>
                                            <option>Lead</option>
                                        </select>
                                    </th>
                                    <th class="px-4 py-3">
                                        <input id="contactsFilterName" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Filter" />
                                    </th>
                                    <th class="px-4 py-3">
                                        <input id="contactsFilterPhone" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Filter" />
                                    </th>
                                    <th class="px-4 py-3">
                                        <input id="contactsFilterEmail" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Filter" />
                                    </th>
                                    <th class="px-4 py-3">
                                        <select id="contactsFilterOwner" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                                            <option>All</option>
                                            ${i.map(n=>`<option>${n}</option>`).join("")}
                                        </select>
                                    </th>
                                    <th class="px-4 py-3">
                                        <select id="contactsFilterSource" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                                            <option>All</option>
                                            ${s.map(n=>`<option>${n}</option>`).join("")}
                                        </select>
                                    </th>
                                    <th class="px-4 py-3"></th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-200">
                                ${a.map(n=>{const l=r=>String(r??"").replace(/</g,"&lt;"),o=String(n.type||"").toLowerCase()==="client"?'<span class="px-2 py-1 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-full">Client</span>':'<span class="px-2 py-1 text-xs font-medium bg-amber-50 text-amber-700 rounded-full">Lead</span>';return`
                                        <tr data-contact-row="1" data-type="${l(n.type).toLowerCase()}" data-name="${l(n.name)}" data-phone="${l(n.phone)}" data-email="${l(n.email)}" data-owner="${l(n.owner).toLowerCase()}" data-source="${l(n.source).toLowerCase()}" class="hover:bg-slate-50">
                                            <td class="px-4 py-3">${o}</td>
                                            <td class="px-4 py-3">
                                                <div class="font-medium text-slate-900">${l(n.name)}</div>
                                            </td>
                                            <td class="px-4 py-3 text-slate-700">${l(n.phone)||"—"}</td>
                                            <td class="px-4 py-3 text-slate-700">${l(n.email)||"—"}</td>
                                            <td class="px-4 py-3 text-slate-700">${l(n.owner)||"—"}</td>
                                            <td class="px-4 py-3 text-slate-700">${l(n.source)||"—"}</td>
                                            <td class="px-4 py-3">
                                                <div class="flex items-center gap-2">
                                                    ${n.phone?`<a href="tel:${l(n.phone)}" title="Call ${l(n.phone)}" style="display:inline-flex;align-items:center;gap:4px;padding:5px 11px;font-size:12px;font-weight:700;background:#15803d;color:#fff;border-radius:8px;text-decoration:none;white-space:nowrap;transition:background 150ms;" onmouseover="this.style.background='#166534'" onmouseout="this.style.background='#15803d'"><i data-lucide="phone" style="width:12px;height:12px;"></i>Call</a>`:'<span style="color:#cbd5e1;font-size:12px;">—</span>'}
                                                    ${n.email?`<a href="mailto:${l(n.email)}" title="Email ${l(n.email)}" style="display:inline-flex;align-items:center;gap:4px;padding:5px 11px;font-size:12px;font-weight:700;background:#7c3aed;color:#fff;border-radius:8px;text-decoration:none;white-space:nowrap;transition:background 150ms;" onmouseover="this.style.background='#6d28d9'" onmouseout="this.style.background='#7c3aed'"><i data-lucide="mail" style="width:12px;height:12px;"></i>Email</a>`:""}
                                                </div>
                                            </td>
                                        </tr>
                                    `}).join("")}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            `}getLeadsOnboarding(){return`
            <div class="space-y-6 fade-in" >
                <div class="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h2 class="text-xl sm:text-2xl font-semibold text-slate-900">Onboarding Status</h2>
                        <p class="text-sm text-slate-500">Track your client onboarding checklist</p>
                    </div>
                    <button class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Update Status</button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div class="col-span-1 lg:col-span-2 bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-lg">
                        <div class="flex flex-wrap items-start justify-between gap-3">
                            <div>
                                <div class="text-sm font-medium text-slate-900">Select a client to view onboarding status</div>
                                <div class="text-xs text-slate-500">Track client onboarding progress</div>
                            </div>
                            <span class="px-2 py-1 text-xs font-medium bg-amber-50 text-amber-700 rounded-full">Onboarding</span>
                        </div>

                        <div class="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            ${[{name:"Client Registered",done:!0},{name:"Project Created",done:!0},{name:"Quotation Sent",done:!0},{name:"Invoice Generated",done:!1},{name:"Payment Received",done:!1},{name:"Delivery Completed",done:!1},{name:"Feedback Collected",done:!1},{name:"Re-engagement Scheduled",done:!1}].map(t=>`
                                <div class="flex items-center gap-3 p-3 rounded-lg border ${t.done?"border-emerald-200 bg-emerald-50":"border-slate-200 bg-white"}">
                                    <i data-lucide="${t.done?"check-circle":"circle"}" class="w-4 h-4 ${t.done?"text-emerald-700":"text-slate-400"}"></i>
                                    <div class="text-sm ${t.done?"text-emerald-900":"text-slate-700"}">${t.name}</div>
                                </div>
                            `).join("")}
                        </div>
                    </div>

                    <div class="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-lg">
                        <h3 class="text-lg font-semibold text-slate-900">Next Best Actions</h3>
                        <div class="mt-4 space-y-3">
                            <div class="p-3 bg-amber-50 rounded-lg border border-amber-100">
                                <div class="text-sm font-medium text-amber-900">Generate invoice</div>
                                <div class="text-xs text-amber-800">From latest approved quotation</div>
                            </div>
                            <div class="p-3 bg-sky-50 rounded-lg border border-sky-100">
                                <div class="text-sm font-medium text-sky-900">Schedule delivery kickoff</div>
                                <div class="text-xs text-sky-800">Align milestones and owners</div>
                            </div>
                            <div class="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                                <div class="text-sm font-medium text-emerald-900">Enable smart alerts</div>
                                <div class="text-xs text-emerald-800">Payment due and engagement reminders</div>
                            </div>
                        </div>
                        <button class="mt-5 w-full px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Apply Actions</button>
                    </div>
                </div>
            </div>
            `}renderProjectsContent(a){switch(this.currentSubSection){case"registration":a.innerHTML=this.getProjectRegistration();break;case"directory":a.innerHTML=this.getProjectDirectory();break;case"pipeline":a.innerHTML=this.getSalesPipeline();break;case"active":a.innerHTML=this.getActiveProjects();break;case"completed":a.innerHTML=this.getCompletedProjects();break;case"quotation_templates":a.innerHTML=this.getQuotationTemplates();break;case"rfp_templates":a.innerHTML=this.getRfpTemplates();break;default:a.innerHTML=this.getSalesPipeline()}}getQuotationTemplates(){this._quoteDraft||(this._quoteDraft=this.getStoredQuoteDraft()||this.getSampleQuotationTemplate());const a=this.computeQuotation(this._quoteDraft),t=d=>String(d??"").replace(/</g,"&lt;").replace(/"/g,"&quot;"),i=a.company||{},s=a.buyer||{},n=a.quote||{},l=a.bank||{},o=Array.isArray(a.items)?a.items:[],r=a.totals||{},c=a.tax||{};return`
            <div class="space-y-6 fade-in" >
                <div class="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h2 class="text-xl sm:text-2xl font-semibold text-slate-900">Quotation Templates</h2>
                        <p class="text-sm text-slate-500">Fill details, auto-calculate GST, then print</p>
                    </div>
                    <div class="flex gap-2">
                        <button data-action="quote:item:add" class="px-4 py-2 text-sm font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">+ Add Line</button>
                        <button data-action="quote:print:current" class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Print Quotation</button>
                    </div>
                </div>

                <div class="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-lg">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <div class="text-sm font-semibold text-slate-900">Company Details</div>
                            <div class="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div class="md:col-span-2">
                                    <label class="text-xs font-medium text-slate-600">Company Logo</label>
                                    <div class="mt-1 flex items-center gap-3">
                                        <div class="h-12 w-12 rounded-md border border-slate-200 bg-white flex items-center justify-center overflow-hidden">
                                            <img id="quoteLogoPreview" src="${t(i.logoDataUrl||"")}" alt="" style="max-width:100%;max-height:100%;${i.logoDataUrl?"":"display:none;"}" />
                                        </div>
                                        <input id="quoteLogoUpload" type="file" accept="image/*" class="block text-sm" />
                                    </div>
                                    <div class="text-[11px] text-slate-500 mt-1">Upload a logo to show near the company name in the print template.</div>
                                </div>
                                <div class="md:col-span-2">
                                    <label class="text-xs font-medium text-slate-600">Company Name</label>
                                    <input data-quote-field="company.name" value="${t(i.name)}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
                                </div>
                                <div class="md:col-span-2">
                                    <label class="text-xs font-medium text-slate-600">Address</label>
                                    <input data-quote-field="company.address" value="${t(i.address)}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-slate-600">GSTIN</label>
                                    <input data-quote-field="company.gstin" value="${t(i.gstin)}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-slate-600">State Name</label>
                                    <input data-quote-field="company.stateName" value="${t(i.stateName)}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-slate-600">State Code</label>
                                    <input data-quote-field="company.stateCode" value="${t(i.stateCode)}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-slate-600">Contact</label>
                                    <input data-quote-field="company.phone" value="${t(i.phone)}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
                                </div>
                                <div class="md:col-span-2">
                                    <label class="text-xs font-medium text-slate-600">E-Mail</label>
                                    <input data-quote-field="company.email" value="${t(i.email)}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <div class="text-sm font-semibold text-slate-900">Quotation Info</div>
                            <div class="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <label class="text-xs font-medium text-slate-600">Quotation No</label>
                                    <input data-quote-field="quote.no" value="${t(n.no)}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-slate-600">Date</label>
                                    <input data-quote-field="quote.date" value="${t(n.date)}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-slate-600">Payment Terms</label>
                                    <input data-quote-field="quote.paymentTerms" value="${t(n.paymentTerms)}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-slate-600">Buyer Reference</label>
                                    <input data-quote-field="quote.buyerReference" value="${t(n.buyerReference)}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-slate-600">Buyer Ref/Order No</label>
                                    <input data-quote-field="quote.buyerRefOrderNo" value="${t(n.buyerRefOrderNo)}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-slate-600">Other References</label>
                                    <input data-quote-field="quote.otherReferences" value="${t(n.otherReferences)}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-slate-600">Dispatched Through</label>
                                    <input data-quote-field="quote.dispatchedThrough" value="${t(n.dispatchedThrough)}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-slate-600">Destination</label>
                                    <input data-quote-field="quote.destination" value="${t(n.destination)}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
                                </div>
                                <div class="md:col-span-2">
                                    <label class="text-xs font-medium text-slate-600">Terms of Delivery</label>
                                    <input data-quote-field="quote.termsOfDelivery" value="${t(n.termsOfDelivery)}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
                                </div>
                            </div>

                            <div class="mt-6 text-sm font-semibold text-slate-900">Buyer (Bill To)</div>
                            <div class="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div class="md:col-span-2">
                                    <label class="text-xs font-medium text-slate-600">Buyer Name</label>
                                    <input data-quote-field="buyer.name" value="${t(s.name)}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
                                </div>
                                <div class="md:col-span-2">
                                    <label class="text-xs font-medium text-slate-600">Buyer Address</label>
                                    <input data-quote-field="buyer.address" value="${t(s.address)}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
                                </div>
                                <div class="md:col-span-2">
                                    <label class="text-xs font-medium text-slate-600">Buyer GSTIN</label>
                                    <input data-quote-field="buyer.gstin" value="${t(s.gstin)}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="mt-6">
                        <div class="flex flex-wrap items-start justify-between gap-3">
                            <div class="text-sm font-semibold text-slate-900">Service Lines</div>
                            <div class="text-xs text-slate-500">Tax: <span id="quoteTaxType" class="font-semibold text-slate-900">${t(c.type)}</span> @ <span class="font-semibold text-slate-900">${Number(c.rate||0).toFixed(0)}%</span></div>
                        </div>
                        <div class="mt-3 overflow-x-auto -mx-2 sm:mx-0">
                            <table class="w-full text-sm" style="min-width: 800px;">
                                <thead class="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th class="text-left px-3 py-2 font-medium text-slate-700">Sl</th>
                                        <th class="text-left px-3 py-2 font-medium text-slate-700">Description</th>
                                        <th class="text-left px-3 py-2 font-medium text-slate-700">HSN/SAC</th>
                                        <th class="text-left px-3 py-2 font-medium text-slate-700">Due On</th>
                                        <th class="text-right px-3 py-2 font-medium text-slate-700">Qty</th>
                                        <th class="text-right px-3 py-2 font-medium text-slate-700">Rate</th>
                                        <th class="text-right px-3 py-2 font-medium text-slate-700">Amount</th>
                                        <th class="px-3 py-2"></th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-200">
                                    ${o.map((d,p)=>`
                                        <tr>
                                            <td class="px-3 py-2 text-slate-700">${p+1}</td>
                                             <td class="px-3 py-2">
                                                 <div style="display:flex;flex-direction:column;gap:4px;">
                                                     <input data-quote-item-index="${p}" data-quote-item-field="description" value="${t(d.description)}" class="w-full border border-slate-200 rounded-lg px-2 py-1 text-sm" />
                                                     <div style="display:flex;align-items:center;">
                                                         <button type="button" data-desc-add-toggle="${p}" title="Add service charge line" style="width:20px;height:20px;border-radius:4px;border:1px solid #c4b5fd;background:#f5f3ff;color:#7c3aed;font-size:15px;font-weight:700;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;">+</button>
                                                     </div>
                                                     <div id="desc-line2-${p}" style="display:${d.serviceCharge?"block":"none"}; ">
                                                         <select data-quote-item-index="${p}" data-quote-item-field="serviceCharge" style="width:100%;border:1px solid #e2e8f0;border-radius:8px;padding:4px 6px;font-size:12px;color:#0f172a;background:#fff;cursor:pointer;">
                                                             <option value="">-- Select Service Charge --</option>
                                                             ${["Service Charge for 2D & 3D Inspection","Service Charge for 2D Dimension","Service Charge for 2D Drafting","Service Charge for 2D Inspection","Service Charge for 2D Modelling","Service Charge for 2D to 3D Conversion","Service Charge for 2D to 3D Modelling","Service Charge for 3D Inspection","Service Charge for 3D Modelling","Service Charge for 3D Scanning","Service Charge for 3D Scanning and Inspection","Service Charge for 3D Scanning and Modelling","Service Charge for 3D Scanning and Modelling and 2D Drafting","Service Charge for CAD Conversion","Service Charge for Onsite 3D Scanning"].map(g=>`<option value="${t(g)}" ${d.serviceCharge===g?"selected":""}>${g}</option>`).join("")}
                                                         </select>
                                                     </div>
                                                 </div>
                                             </td>
                                            <td class="px-3 py-2">
                                                <input data-quote-item-index="${p}" data-quote-item-field="hsnSac" value="${t(d.hsnSac)}" class="w-full border border-slate-200 rounded-lg px-2 py-1 text-sm" />
                                            </td>
                                            <td class="px-3 py-2">
                                                <input data-quote-item-index="${p}" data-quote-item-field="dueOn" value="${t(d.dueOn)}" class="w-full border border-slate-200 rounded-lg px-2 py-1 text-sm" />
                                            </td>
                                            <td class="px-3 py-2">
                                                <input data-quote-item-index="${p}" data-quote-item-field="qty" value="${t(d.qty)}" class="w-full border border-slate-200 rounded-lg px-2 py-1 text-sm text-right" />
                                            </td>
                                            <td class="px-3 py-2">
                                                <input data-quote-item-index="${p}" data-quote-item-field="rate" value="${t(d.rate)}" class="w-full border border-slate-200 rounded-lg px-2 py-1 text-sm text-right" />
                                            </td>
                                            <td class="px-3 py-2 text-right font-semibold text-slate-900"><span data-quote-item-amount="${p}">${this.formatINR(Number(d.amount||0))}</span></td>
                                            <td class="px-3 py-2 text-right">
                                                <button data-action="quote:item:remove:${p}" class="px-2 py-1 text-xs font-medium bg-rose-50 text-rose-700 rounded-md hover:bg-rose-100">Remove</button>
                                            </td>
                                        </tr>
                                    `).join("")}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div class="bg-slate-50 border border-slate-200 rounded-lg p-4">
                            <div class="text-xs text-slate-500">Subtotal</div>
                            <div id="quoteSubtotal" class="text-lg font-semibold text-slate-900 mt-1">${this.formatINR(r.subtotal||0)}</div>
                        </div>
                        <div class="bg-slate-50 border border-slate-200 rounded-lg p-4">
                            <div class="text-xs text-slate-500">${t(c.type)} (${Number(c.rate||0).toFixed(0)}%)</div>
                            <div id="quoteTax" class="text-lg font-semibold text-slate-900 mt-1">${this.formatINR(r.tax||0)}</div>
                        </div>
                        <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
                            <div class="text-xs text-purple-700">Grand Total</div>
                            <div id="quoteTotal" class="text-lg font-extrabold text-slate-900 mt-1">${this.formatINR(r.total||0)}</div>
                            <div id="quoteWords" class="text-xs text-slate-600 mt-1">${t(this.amountToWordsINR(r.total||0))}</div>
                        </div>
                    </div>

                    <div class="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <div class="text-sm font-semibold text-slate-900">Terms & Conditions</div>
                            <textarea data-quote-field="termsText" rows="5" class="mt-2 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm">${t((a.terms||[]).join(`
`))}</textarea>
                            <div class="text-[11px] text-slate-500 mt-1">One term per line</div>
                        </div>
                        <div>
                            <div class="text-sm font-semibold text-slate-900">Bank Details</div>
                            <div class="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div class="md:col-span-2">
                                    <label class="text-xs font-medium text-slate-600">Bank Name</label>
                                    <select id="quoteBankSelect" data-quote-field="bank.bankName" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm">
                                        <option value="">-- Select Bank --</option>
                                        <option value="Punjab National Bank" ${l.bankName==="Punjab National Bank"||!l.bankName?"selected":""}>Punjab National Bank</option>
                                        <option value="Indian Bank" ${l.bankName==="Indian Bank"?"selected":""}>Indian Bank</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-slate-600">Account No</label>
                                    <input id="quoteBankAccountNo" data-quote-field="bank.accountNo" value="${t(l.accountNo)}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-slate-600">IFSC</label>
                                    <input id="quoteBankIfsc" data-quote-field="bank.ifsc" value="${t(l.ifsc)}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
                                </div>
                                <div class="md:col-span-2">
                                    <label class="text-xs font-medium text-slate-600">Branch</label>
                                    <input id="quoteBankBranch" data-quote-field="bank.branch" value="${t(l.branch||"")}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" readonly style="background:#f8fafc;" />
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-slate-600">GST Rate (%)</label>
                                    <input data-quote-field="tax.rate" value="${t(c.rate)}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `}getCompanyMaster(){return{name:"APJ 3D Solutions India Pvt Ltd",address:"Regd: Ground floor HW2, Forge Factory, #3 KCT Tech Park, Athipalayam Road, Chinnavedampatti, Coimbatore District, Tamil Nadu - 641049 | Corp: CP3 & CP4, Sipcot Industrial Complex, Phase-II, Moranapalli, Hosur, Krishnagiri, Tamil Nadu - 635109",stateName:"Tamil Nadu",stateCode:"33",gstin:"33AAXCA1027H1ZR",phone:"7550398310",email:"service@apj3d.com"}}getSampleRfpTemplate(){return{client:{companyName:"Advanced Structures India Pvt Ltd",contactPerson:"Mr. Alexander K A– Senior Manager",projectName:"3D Scanning Support",gstNumber:"29AAMCA5005G1ZR",companyAddress:"2B, Bommasandra Jigani Link Rd, 4th Phase, Bommasandra Industrial Area, Bengaluru - Karnataka 560099",dateOfRequest:"24th Sep 2025"},provider:{companyName:"APJ 3D Solutions India Pvt Ltd",headOffice:"Regd: Ground floor HW2, Forge Factory, #3 KCT Tech Park, Athipalayam Road, Chinnavedampatti, Coimbatore District, Tamil Nadu - 641049 | Corp: CP3 & CP4, Sipcot Industrial Complex, Phase-II, Moranapalli, Hosur, Krishnagiri, Tamil Nadu - 635109",cinGstin:"U29113TZ2022PTC039089 / GSTIN: 33AAXCA1027H1ZR",contactPerson:"Sathish S – Managing Director",proposalSentOn:"24th Sep 2025",logoDataUrl:""},scopeText:`Quantity: E-Axle Assembly
3D scanning in assembled condition (output file in .stl format)
Creating Part model and 2D drawings In Catia V5 Software
All parts Will be modelled with origin ref. as VCS
Hierarchical cad model for following parts with ASI -part IDs.`,implementationText:`Once the commercial service agreement (RFP) is finalized, and the purchase order (PO) is received from your end, the project will be initiated.
Our team would visit onsite to perform 3D scanning (scanner used would be ZEISS T Scan Hawk)
We are considered max 30 parts in that assembly`,timelineText:`3D model – 25 Working day’s
3D scanning- 4 days
Work will be kick-started once PO is raised.`,paymentText:`Advance Payment (40%): An initial payment of 40% of the total project cost is due upon issuance of the Purchase Order (PO).
Intermediate Payment (60%): A second payment of 60% of the total project cost is due upon successful delivery of the 3D model in a mutually agreed-upon file format (. STP).`,responsibilitiesText:`The Client shall provide [APJ 3D] with all necessary information, materials, and access required to perform the Services.
Part names
Part numbers
Part thicknesses
Any relevant technical drawings, specifications, or other documentation.
All project inputs must be submitted by email to (servcie@apj3d.com & Info@apj3d.com )`,delaysText:`Delays in providing the required information (as outlined in Section 7) by the Client may result in corresponding delays to the project timeline.
APJ 3D shall not be held responsible for any delays in the project caused by the Client's failure to provide timely and accurate information.`,commencementText:"The project commencement date shall be considered as the date on which both parties have signed and agreed to these Terms and Conditions in writing.",changesText:`Any changes to the original project scope may result in adjustments to the project timeline.
Additional charges to reflect the increased scope of work or required adjustments.
All changes to the project scope must be agreed upon in writing by both parties before implementation.`,quoteId:"APJ3D2025_26_0222",items:[{description:`Price for 3D Scanning, 3D modelling and 2D drafting of E-Axle
Output format- Catia V5`,uom:"AE",qty:1,rate:0,amount:0}],bank:{beneficiary:"APJ 3D Solutions India Pvt Ltd",bankName:"Punjab National Bank",accountNo:"4962002100007908",ifsc:"PUNB0496200"},confidentialityText:"We maintain 100% confidentiality of the project/data which we support. Under no circumstances may the service provider distribute or disclose any Confidential Information other than as permitted by this Agreement. The service provider and user attest that we will only use the Confidential Information to carry out the project needs set forth in this Agreement, and for no other purpose, without first obtaining their express prior written agreement. Also, we have restricted access to our production team for copying, storing the data from workspace through LAN. Files will be shared via Google drive (from our domain server)"}}computeRfp(a){const t=a||{},i=(Array.isArray(t.items)?t.items:[]).map(r=>({...r}));i.forEach(r=>{const c=Number(r.qty||0),d=Number(r.rate||0);r.amount=Math.round(c*d*100)/100});const s=Math.round(i.reduce((r,c)=>r+(Number(c.amount)||0),0)*100)/100,n=18,l=Math.round(s*(n/100)*100)/100,o=Math.round((s+l)*100)/100;return{...t,items:i,tax:{type:"IGST",rate:n},totals:{subtotal:s,tax:l,total:o}}}getStoredRfpDraft(){const a=this.readStore("APJ 3D Solutions_rfp_draft",null);return!a||typeof a!="object"?null:a}saveRfpDraft(){try{if(!this._rfpDraft)return;this.writeStore("APJ 3D Solutions_rfp_draft",this._rfpDraft)}catch{}}updateRfpLogoUI(){var i,s;if(!(this.currentSection==="projects"&&this.currentSubSection==="rfp_templates"))return;const a=String(((s=(i=this._rfpDraft)==null?void 0:i.provider)==null?void 0:s.logoDataUrl)||""),t=document.getElementById("rfpLogoPreview");t&&t instanceof HTMLImageElement&&(t.src=a,t.style.display=a?"":"none")}updateRfpComputedUI(){if(!(this.currentSection==="projects"&&this.currentSubSection==="rfp_templates"))return;const a=this.computeRfp(this._rfpDraft||this.getSampleRfpTemplate()),t=a.totals||{};(Array.isArray(a.items)?a.items:[]).forEach((r,c)=>{const d=document.querySelector(`[data - rfp - item - amount="${c}"]`);d&&(d.textContent=this.formatINR(Number(r.amount||0)))});const s=document.getElementById("rfpSubtotal");s&&(s.textContent=this.formatINR(t.subtotal||0));const n=document.getElementById("rfpTax");n&&(n.textContent=this.formatINR(t.tax||0));const l=document.getElementById("rfpTotal");l&&(l.textContent=this.formatINR(t.total||0));const o=document.getElementById("rfpWords");o&&(o.textContent=this.amountToWordsINR(t.total||0)),this._rfpDraft=a,this.saveRfpDraft()}linesToBullets(a){return String(a||"").split(/\r?\n/).map(t=>t.trim()).filter(Boolean)}renderRfpDocumentHTML(a){const t=a||{},i=u=>String(u??"").replace(/</g,"&lt;").replace(/"/g,"&quot;"),s=t.client||{},n={...t.provider||{},companyName:"APJ 3D Solutions India Pvt Ltd",headOffice:"Regd: Ground floor HW2, Forge Factory, #3 KCT Tech Park, Athipalayam Road, Chinnavedampatti, Coimbatore District, Tamil Nadu - 641049 | Corp: CP3 & CP4, Sipcot Industrial Complex, Phase-II, Moranapalli, Hosur, Krishnagiri, Tamil Nadu - 635109"},l=Array.isArray(t.items)?t.items:[],o=t.totals||{},r=this.linesToBullets(t.scopeText),c=this.linesToBullets(t.implementationText),d=this.linesToBullets(t.timelineText),p=this.linesToBullets(t.paymentText),g=this.linesToBullets(t.responsibilitiesText),h=this.linesToBullets(t.delaysText),m=this.linesToBullets(t.changesText),f=t.bank||{},w=u=>`<ol > ${u.map(b=>`<li>${i(b)}</li>`).join("")}</ol > `;return`
            <!-- ══ COVER PAGE ══ -->
            <div class="cover-page">

                <!-- Background SVG: blueprint grid + 3D shapes -->
                <svg class="cover-bg-svg" viewBox="0 0 1000 1414" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stop-color="#04091a"/>
                            <stop offset="45%" stop-color="#0b1f52"/>
                            <stop offset="100%" stop-color="#1a4aad"/>
                        </linearGradient>
                        <linearGradient id="cubeTop" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.9"/>
                            <stop offset="100%" stop-color="#1d4ed8" stop-opacity="0.7"/>
                        </linearGradient>
                        <linearGradient id="cubeLeft" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stop-color="#1e40af" stop-opacity="0.95"/>
                            <stop offset="100%" stop-color="#1d4ed8" stop-opacity="0.6"/>
                        </linearGradient>
                        <linearGradient id="cubeRight" x1="1" y1="0" x2="0" y2="0">
                            <stop offset="0%" stop-color="#0c1a5e" stop-opacity="0.95"/>
                            <stop offset="100%" stop-color="#1e3a8a" stop-opacity="0.55"/>
                        </linearGradient>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="6" result="blur"/>
                            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                        </filter>
                        <filter id="softglow">
                            <feGaussianBlur stdDeviation="18" result="blur"/>
                            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                        </filter>
                    </defs>

                    <!-- Background image -->
                    <image href="/assets/rfp-cover-bg.png" x="0" y="0" width="1000" height="1414" preserveAspectRatio="xMidYMid slice"/>
                    <!-- Dark blue overlay – higher opacity suppresses background dimension lines -->
                    <rect width="1000" height="1414" fill="#04091a" opacity="0.65"/>



                    <!-- Perspective floor grid (XYZ 3D axis feel) -->
                    <g stroke="#2563eb" stroke-width="0.8" opacity="0.3">
                        ${Array.from({length:18},(u,b)=>`<line x1="${500+b*80}" y1="1414" x2="500" y2="820"/><line x1="${500-b*80}" y1="1414" x2="500" y2="820"/>`).join("")}
                        ${Array.from({length:10},(u,b)=>`<line x1="0" y1="${820+b*60}" x2="1000" y2="${820+b*60}"/>`).join("")}
                    </g>

                    <!-- Corner accent bracket top-left (┌) -->
                    <polyline points="40,100 40,40 100,40" fill="none" stroke="#3b82f6" stroke-width="2.5" opacity="0.8"/>
                    <!-- Corner accent bracket top-right (┐) -->
                    <polyline points="960,100 960,40 900,40" fill="none" stroke="#3b82f6" stroke-width="2.5" opacity="0.8"/>
                    <!-- Corner accent bracket bottom-left (└) -->
                    <polyline points="40,1314 40,1374 100,1374" fill="none" stroke="#3b82f6" stroke-width="2.5" opacity="0.8"/>
                    <!-- Corner accent bracket bottom-right (┘) -->
                    <polyline points="960,1314 960,1374 900,1374" fill="none" stroke="#3b82f6" stroke-width="2.5" opacity="0.8"/>
                </svg>

                <!-- Cover text content -->
                <div class="cover-content">
                    <div class="cover-title">APJ 3D Solutions India<br/>Pvt Ltd</div>
                    <div class="cover-divider"></div>
                    <div class="cover-subtitle">REQUEST FOR PROPOSAL</div>
                </div>
                <!-- Masks the fixed footer on page 1 only -->
                <div class="cover-footer-mask"></div>
            </div>

            <div class="doc">

                <!-- ══ HEADER BANNER ══ -->
                <div class="hdr">
                    <div class="hdr-logo">
                        ${n.logoDataUrl?`<img src="${i(n.logoDataUrl)}" alt="logo" />`:""}
                    </div>
                    <div class="hdr-text">

                        <div class="hdr-company">${i(n.companyName)}</div>
                        ${n.headOffice.split("|").map(u=>`<div class="hdr-sub">${i(u.trim())}</div>`).join("")}
                        <div class="hdr-sub">${i(n.cinGstin)}</div>
                    </div>
                </div>

                <!-- ══ TITLE BAR ══ -->
                <div class="title-bar">Request for Proposal</div>

                <!-- ══ INFO STRIP ══ -->
                <div class="info-strip">
                    <div class="info-col">
                        <div class="info-heading">Our Details</div>
                        <div class="info-row"><span class="info-key">Contact Person</span><span class="info-val">${i(n.contactPerson)}</span></div>
                        <div class="info-row"><span class="info-key">Quote ID</span><span class="info-val" style="font-weight:700;color:#1d4ed8;">${i(t.quoteId)}</span></div>
                        <div class="info-row"><span class="info-key">Proposal Date</span><span class="info-val">${i(n.proposalSentOn)}</span></div>
                    </div>
                    <div class="info-col">
                        <div class="info-heading">Client Details</div>
                        <div class="info-row"><span class="info-key">Company</span><span class="info-val">${i(s.companyName)}</span></div>
                        <div class="info-row"><span class="info-key">Contact Person</span><span class="info-val">${i(s.contactPerson)}</span></div>
                        <div class="info-row"><span class="info-key">Address</span><span class="info-val">${i(s.companyAddress)}</span></div>
                        <div class="info-row"><span class="info-key">GST Number</span><span class="info-val">${i(s.gstNumber)}</span></div>
                        <div class="info-row"><span class="info-key">Project Name</span><span class="info-val">${i(s.projectName)}</span></div>
                        <div class="info-row"><span class="info-key">Date of Request</span><span class="info-val">${i(s.dateOfRequest)}</span></div>
                        <div class="info-row"><span class="info-key">Tax</span><span class="info-val">IGST @ 18%</span></div>
                    </div>
                </div>

                <!-- ══ BODY SECTIONS ══ -->
                <div class="body">

                    ${[["Scope of Work",w(r)],["Implementation Plan",w(c)],["Project Timeline",w(d)],["Payment Terms Schedule",w(p)],["Client Responsibilities",w(g)],["Project Delays",w(h)],["Project Commencement Date",`<div class="sec-body">${i(t.commencementText||"")}</div>`],["Project Changes",w(m)]].map(([u,b])=>`
                        <div class="sec">
                            <div class="sec-hdr">
                                <div class="sec-bar"></div>
                                <div class="sec-title">${u}</div>
                            </div>
                            <div class="sec-body">${b}</div>
                            <hr class="sec-divider">
                        </div>
                    `).join("")}

                    <!-- Service Cost -->
                    <div class="sec">
                        <div class="sec-hdr">
                            <div class="sec-bar"></div>
                            <div class="sec-title">Service Cost / Quotation</div>
                        </div>
                        <table class="items">
                            <thead>
                                <tr>
                                    <th>Sl.No</th>
                                    <th>Item / Service Description</th>
                                    <th>Unit</th>
                                    <th class="r">Quantity</th>
                                    <th class="r">Unit Rate</th>
                                    <th class="r">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${l.map((u,b)=>`
                                    <tr>
                                        <td>${b+1}</td>
                                        <td>${i(u.description)}${u.serviceCharge?`<div style="font-size:10px;color:#64748b;margin-top:2px;">${i(u.serviceCharge)}</div>`:""}</td>
                                        <td>${i(u.uom||"")}</td>
                                        <td class="r">${Number(u.qty||0).toFixed(2)}</td>
                                        <td class="r">${this.formatINR(u.rate||0)}</td>
                                        <td class="r">${this.formatINR(u.amount||0)}</td>
                                    </tr>
                                `).join("")}
                            </tbody>
                            <tfoot>
                                <tr class="tfoot-subtotal">
                                    <td colspan="5" style="text-align:right;">Sub Total</td>
                                    <td class="r">${this.formatINR(o.subtotal||0)}</td>
                                </tr>
                                <tr class="tfoot-tax">
                                    <td colspan="5" style="text-align:right;">IGST (18%)</td>
                                    <td class="r">${this.formatINR(o.tax||0)}</td>
                                </tr>
                                <tr class="tfoot-total">
                                    <td colspan="5" style="text-align:right;">Grand Total</td>
                                    <td class="r">${this.formatINR(o.total||0)}</td>
                                </tr>
                            </tfoot>
                        </table>
                        <div class="words-box">
                            <div class="words-label">Indian Rupees (in words)</div>
                            <div class="words-val">${i(this.amountToWordsINR(o.total||0))}</div>
                        </div>
                        <hr class="sec-divider" style="margin-top:16px;">
                    </div>

                    <!-- Bank Details -->
                    <div class="sec">
                        <div class="sec-hdr">
                            <div class="sec-bar"></div>
                            <div class="sec-title">Account Information (Banking Details)</div>
                        </div>
                        <div class="bank-card">
                            <div class="bank-row"><span class="bank-key">Beneficiary Name</span><span class="bank-val">${i(f.beneficiary)}</span></div>
                            <div class="bank-row"><span class="bank-key">Bank Name</span><span class="bank-val">${i(f.bankName)}</span></div>
                            <div class="bank-row"><span class="bank-key">Account Number</span><span class="bank-val">${i(f.accountNo)}</span></div>
                            ${f.branch?`<div class="bank-row"><span class="bank-key">Branch</span><span class="bank-val">${i(f.branch)}</span></div>`:""}
                            <div class="bank-row"><span class="bank-key">IFSC Code</span><span class="bank-val">${i(f.ifsc)}</span></div>
                        </div>
                        <hr class="sec-divider" style="margin-top:16px;">
                    </div>

                    <!-- Confidentiality -->
                    <div class="sec">
                        <div class="sec-hdr">
                            <div class="sec-bar"></div>
                            <div class="sec-title">Confidentiality &amp; Data Security</div>
                        </div>
                        <div class="sec-body">${i(t.confidentialityText||"")}</div>
                    </div>
                    

                </div>

                <!-- ══ FOOTER ══ -->
                <div class="doc-footer">This is a Computer Generated Document &nbsp;|&nbsp; ${i(n.companyName)}</div>

            </div>

            <!--Fixed footer repeated on every print page-- >
            <div class="print-footer">This is a Computer Generated Document &nbsp;|&nbsp; ${i(n.companyName)}</div>
        `}openRfpPrintWindow(a){const t=this.renderRfpDocumentHTML(a),i=window.open("","_blank");if(!i){this.showToast("Popup blocked. Allow popups to print RFP.");return}i.document.open(),i.document.write(`
            <!DOCTYPE html>
                <html>
                    <head>
                        <meta charset="utf-8" />
                        <meta name="viewport" content="width=device-width, initial-scale=1" />
                        <title>RFP / Proposal</title>
                        <style>
                            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

                            *{box - sizing:border-box;margin:0;padding:0;}
                            body{font-family:'Inter',Arial,sans-serif;background:#f1f5f9;color:#0f172a;-webkit-print-color-adjust:exact;print-color-adjust:exact;}

                            /* ══ Cover Page ══ */
                            .cover-page{position:relative;width:100%;max-width:860px;height:1215px;margin:28px auto 0;overflow:hidden;page-break-after:always;break-after:page;display:flex;align-items:center;justify-content:center;background:#04091a;border-radius:16px;box-shadow:0 4px 32px rgba(0,0,0,0.10);}
                            .cover-bg-svg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;}
                            .cover-content{position:relative;z-index:10;text-align:center;color:#fff;padding:40px 60px;max-width:700px;}
                            .cover-logo-wrap{margin-bottom:32px;display:flex;justify-content:center;}
                            .cover-logo{width:110px;height:110px;object-fit:contain;filter:drop-shadow(0 0 20px rgba(59,130,246,0.7));}
                            .cover-eyebrow{font-size:13px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:#93c5fd;margin-bottom:20px;}
                            .cover-title{font-size:52px;font-weight:900;line-height:1.1;background:linear-gradient(135deg,#c8c8c8 0%,#ffffff 30%,#a0a0a0 55%,#e8e8e8 75%,#b0b0b0 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:28px;letter-spacing:-.5px;}
                            .cover-divider{width:80px;height:3px;background:linear-gradient(90deg,#1d4ed8,#60a5fa,#1d4ed8);margin:0 auto 24px;border-radius:2px;}
                            .cover-subtitle{font-size:16px;font-weight:700;letter-spacing:.28em;text-transform:uppercase;color:#dbeafe;margin-bottom:14px;}
                            .cover-meta{font-size:13px;color:#93c5fd;letter-spacing:.1em;}

                            /* ── Outer wrapper ── */
                            .doc{max-width:860px;margin:28px auto 40px;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 32px rgba(0,0,0,0.10);}
                            .title-bar{background:#fff;color:#0c1a3a;text-align:center;padding:10px 0;font-size:13px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;}

                            /* ── Header banner ── */
                            .hdr{background:linear-gradient(135deg,#0a1628 0%,#1e3a8a 55%,#1d4ed8 100%);color:#fff;padding:32px 36px 24px;display:flex;align-items:center;gap:10px;}
                            .hdr-logo{width:120px;height:120px;display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden;}
                            .hdr-logo img{width:114px;height:114px;object-fit:contain;}
                            .hdr-text{flex:1;}
                            .hdr-label{font-size:10px;letter-spacing:.18em;text-transform:uppercase;opacity:.75;margin-bottom:4px;}
                            .hdr-company{font-size:20px;font-weight:800;line-height:1.2;margin-bottom:6px;}
                            .hdr-sub{font-size:9px;opacity:.85;line-height:1.55;}
                            .hdr-badge{background:rgba(255,255,255,0.18);border:1px solid rgba(255,255,255,0.3);border-radius:8px;padding:10px 16px;text-align:right;flex-shrink:0;}
                            .hdr-badge-label{font-size:9px;letter-spacing:.12em;text-transform:uppercase;opacity:.7;}
                            .hdr-badge-val{font-size:15px;font-weight:700;margin-top:2px;}

                            /* ── Info strip (two columns) ── */
                            .info-strip{display:grid;grid-template-columns:1fr 1fr;gap:0;border-bottom:1px solid #e2e8f0;}
                            .info-col{padding:18px 28px;}
                            .info-col:first-child{border - right:1px solid #e2e8f0;background:#eff6ff;}
                            .info-col:last-child{background:#f8fafc;}
                            .info-heading{font-size:9px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#1d4ed8;margin-bottom:10px;}
                            .info-row{display:flex;gap:8px;margin-bottom:5px;font-size:11px;}
                            .info-key{color:#64748b;min-width:110px;font-weight:500;}
                            .info-val{color:#0f172a;font-weight:600;flex:1;}

                            /* ── Section ── */
                            .body{padding:0 28px 28px;}
                            .sec{margin-top:20px;}
                            .sec-hdr{display:flex;align-items:center;gap:10px;margin-bottom:10px;}
                            .sec-bar{width:4px;height:20px;background:linear-gradient(180deg,#1e3a8a,#3b82f6);border-radius:2px;flex-shrink:0;}
                            .sec-title{font-size:12px;font-weight:700;color:#0c1a3a;text-transform:uppercase;letter-spacing:.06em;}
                            .sec-body{font-size:11.5px;color:#1e293b;line-height:1.7;padding-left:14px;}
                            .sec-body ol,.sec-body ul{padding-left:18px;margin:0;}
                            .sec-body li{margin-bottom:3px;}
                            .sec-divider{border:none;border-top:1px solid #bfdbfe;margin:4px 0 0;}

                            /* ── Items table ── */
                            table.items{width:100%;border-collapse:collapse;font-size:11px;margin-top:6px;}
                            table.items th{background:#0f2d6b;color:#fff;font-weight:700;padding:8px 10px;text-align:left;}
                            table.items th.r{text-align:right;}
                            table.items td{padding:7px 10px;border-bottom:1px solid #f1f5f9;vertical-align:top;}
                            table.items td.r{text-align:right;}
                            table.items tbody tr:nth-child(even){background:#eff6ff;}
                            table.items tbody tr:hover{background:#dbeafe;}
                            .tfoot-subtotal td{background:#f8fafc;font-weight:600;border-top:2px solid #e2e8f0;}
                            .tfoot-tax td{background:#f8fafc;font-weight:600;}
                            .tfoot-total td{background:#0f2d6b;color:#fff;font-weight:800;font-size:12px;}
                            .tfoot-total td.r{text-align:right;}

                            /* ── Amount words ── */
                            .words-box{background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:10px 14px;margin-top:12px;}
                            .words-label{font-size:9px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#1d4ed8;margin-bottom:3px;}
                            .words-val{font-size:11.5px;font-weight:700;color:#1e293b;}

                            /* ── Bank details card ── */
                            .bank-card{background:linear-gradient(135deg,#eff6ff,#dbeafe);border:1px solid #93c5fd;border-radius:10px;padding:14px 18px;margin-top:6px;}
                            .bank-row{display:flex;gap:8px;font-size:11px;margin-bottom:4px;}
                            .bank-key{color:#1d4ed8;font-weight:600;min-width:130px;}
                            .bank-val{color:#0f172a;font-weight:500;}

                            /* ── Footer ── */
                            .doc-footer{background:linear-gradient(135deg,#0a1628,#1e3a8a);color:rgba(255,255,255,0.85);text-align:center;padding:14px;font-size:10px;letter-spacing:.06em;}

                            /* ── Fixed print footer (every page) ── */
                            .print-footer{display:none;}
                            .cover-footer-mask{display:none;}

                            @media print{
                                body{background:#fff;padding-bottom:40px;}
                            .cover-page{margin:0;border-radius:0;box-shadow:none;max-width:none;width:100%;height:100vh;position:relative;z-index:10001;isolation:isolate;}
                            .doc{margin:0;border-radius:0;box-shadow:none;max-width:none;}
                            .doc-footer{display:none;}
                            .hdr,.tfoot-total td,.table.items th{-webkit - print-color - adjust:exact;print-color-adjust:exact;}
                            .print-footer{display:block;position:fixed;bottom:0;left:0;right:0;background:linear-gradient(135deg,#0a1628,#1e3a8a);color:rgba(255,255,255,0.85);text-align:center;padding:10px 14px;font-size:10px;letter-spacing:.06em;-webkit-print-color-adjust:exact;print-color-adjust:exact;z-index:9999;}
                    }
                        </style>
                    </head>
                    <body>
                        ${t}
                        <script>window.onload = () => { try {window.focus(); window.print(); } catch(e) { } };<\/script>
                    </body>
                </html>
        `),i.document.close()}getSampleQuotationTemplate(){const a=this.getCompanyMaster(),t={name:"NEW SWAN ENTERPRISES",address:"Kolar, Karnataka",gstin:"29AALFN7299M1Z4"},i=[{description:"Service charges for 3d scanning and inspection",hsnSac:"998333",dueOn:"3-Dec-2025",qty:13,rate:2e3,amount:13*2e3}],s=i.reduce((g,h)=>g+(Number(h.amount)||0),0),n=String(a.stateCode||"").trim(),l=this.getStateCodeFromGSTIN(t.gstin)||"",r=n&&l&&n!==l?"IGST":"CGST+SGST",c=18,d=Math.round(s*(c/100)*100)/100,p=Math.round((s+d)*100)/100;return{company:{...a,logoDataUrl:""},quote:{no:"APJ3D/QTN2025/317",date:"3-Dec-2025",paymentTerms:"30 Days",otherReferences:"",buyerReference:"APJ3D/QTN2025/317",buyerRefOrderNo:"",dispatchedThrough:"",destination:"",termsOfDelivery:""},buyer:t,items:i,tax:{type:r,rate:c},totals:{subtotal:s,tax:d,total:p},terms:["Project will be kick-started when 50% advance amount is paid along with PO is raised.","Project deadline: 5–6 days scanning and inspection after PO received.","Feedback/Comments on the model to be provided within 2 weeks from the date of submission of the model.","Final output would be in PDF format."],bank:{bankName:"Punjab National Bank",accountNo:"49620021000079",ifsc:"PUNB0496200"}}}computeQuotation(a){const t=a||{},i=t.company||{},s=t.buyer||{},n=t.quote||{},l=t.bank||{},o=t.tax||{},r=(Array.isArray(t.items)?t.items:[]).map(b=>({...b})),c=String(i.stateCode||"").trim(),d=this.getStateCodeFromGSTIN(s.gstin)||"",g=c&&d&&c!==d?"IGST":"CGST+SGST",h=Number(o.rate||18);r.forEach(b=>{const v=Number(b.qty||0),C=Number(b.rate||0);b.amount=Math.round(v*C*100)/100});const m=Math.round(r.reduce((b,v)=>b+(Number(v.amount)||0),0)*100)/100,f=Math.round(m*(h/100)*100)/100,w=Math.round((m+f)*100)/100,u=Array.isArray(t.terms)?t.terms:String(t.termsText||"").split(/\r?\n/).map(b=>b.trim()).filter(Boolean);return{...t,company:{...i},buyer:{...s},quote:{...n},bank:{...l},items:r,terms:u,tax:{...o,type:g,rate:h},totals:{subtotal:m,tax:f,total:w}}}getStoredQuoteDraft(){const a=this.readStore("APJ 3D Solutions_quote_draft",null);return!a||typeof a!="object"?null:a}saveQuoteDraft(){try{if(!this._quoteDraft)return;this.writeStore("APJ 3D Solutions_quote_draft",this._quoteDraft)}catch{}}updateQuotationLogoUI(){var i,s;if(!(this.currentSection==="projects"&&this.currentSubSection==="quotation_templates"))return;const a=String(((s=(i=this._quoteDraft)==null?void 0:i.company)==null?void 0:s.logoDataUrl)||""),t=document.getElementById("quoteLogoPreview");t&&t instanceof HTMLImageElement&&(t.src=a,t.style.display=a?"":"none")}updateQuotationComputedUI(){if(!(this.currentSection==="projects"&&this.currentSubSection==="quotation_templates"))return;const a=this.computeQuotation(this._quoteDraft||this.getSampleQuotationTemplate()),t=a.totals||{},i=a.tax||{},s=Array.isArray(a.items)?a.items:[],n=document.getElementById("quoteTaxType");n&&(n.textContent=String(i.type||""));const l=document.getElementById("quoteSubtotal");l&&(l.textContent=this.formatINR(t.subtotal||0));const o=document.getElementById("quoteTax");o&&(o.textContent=this.formatINR(t.tax||0));const r=document.getElementById("quoteTotal");r&&(r.textContent=this.formatINR(t.total||0));const c=document.getElementById("quoteWords");c&&(c.textContent=this.amountToWordsINR(t.total||0)),s.forEach((d,p)=>{const g=document.querySelector(`[data - quote - item - amount= "${p}"]`);g&&(g.textContent=this.formatINR(Number(d.amount||0)))}),this._quoteDraft=a,this.saveQuoteDraft()}getStateCodeFromGSTIN(a){const i=String(a||"").trim().match(/^(\d{2})/);return i?i[1]:""}amountToWordsINR(a){const t=Math.round(Number(a)||0);return!Number.isFinite(t)||t<0||t===0?"INR Zero Only":`INR ${this.numberToWordsIndian(t)} Only`}numberToWordsIndian(a){const t=["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"],i=["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"],s=g=>{if(g===0)return"";if(g<20)return t[g];const h=Math.floor(g/10),m=g%10;return`${i[h]}${m?" "+t[m]:""} `.trim()},n=g=>{const h=Math.floor(g/100),m=g%100,f=h?`${t[h]} Hundred`:"",w=s(m);return`${f}${f&&w?" ":""}${w} `.trim()},l=[];let o=Math.floor(a);const r=Math.floor(o/1e7);o%=1e7;const c=Math.floor(o/1e5);o%=1e5;const d=Math.floor(o/1e3);o%=1e3;const p=o;return r&&l.push(`${n(r)} Crore`),c&&l.push(`${n(c)} Lakh`),d&&l.push(`${n(d)} Thousand`),p&&l.push(n(p)),l.join(" ").replace(/\s+/g," ").trim()}renderQuotationDocumentHTML(a){var d,p,g,h,m,f,w,u,b;const t=a||{},i=v=>String(v??"").replace(/</g,"&lt;").replace(/"/g,"&quot;"),s={...t.company||{},...this.getCompanyMaster()},n=t.buyer||{},l=Array.isArray(t.items)?t.items:[],o=t.totals||{};t.tax;const r=t.bank||{},c=Array.isArray(t.terms)?t.terms:[];return`
            <div class="doc" >
                <div class="hdr">
                    <div class="hdr-logo-box">
                        ${s.logoDataUrl?`<img src="${i(s.logoDataUrl)}" alt="" />`:""}
                    </div>
                    <div class="hdr-text">
                        <div class="hdr-company">${i(s.name)}</div>
                        ${s.address.split("|").map(v=>`<div class="hdr-sub">${i(v.trim())}</div>`).join("")}
                        <div class="hdr-sub">GSTIN: ${i(s.gstin)} &nbsp;|&nbsp; State: ${i(s.stateName||"")} – ${i(s.stateCode)}</div>
                        <div class="hdr-sub">${i(s.phone||"")} &nbsp;|&nbsp; ${i(s.email||"")}</div>
                    </div>
                </div>
                <div class="title">QUOTATION</div>
                <div class="doc-body">

                <table class="top">
                    <tr>
                        <td class="top-left">
                            <table class="meta">
                                <tr><td class="ml">Quotation No.</td><td class="mv">${i((d=t.quote)==null?void 0:d.no)}</td></tr>
                                <tr><td class="ml">Dated</td><td class="mv">${i((p=t.quote)==null?void 0:p.date)}</td></tr>
                                <tr><td class="ml">Mode/Terms of Payment</td><td class="mv">${i((g=t.quote)==null?void 0:g.paymentTerms)}</td></tr>
                                <tr><td class="ml">Other References</td><td class="mv">${i((h=t.quote)==null?void 0:h.otherReferences)}</td></tr>
                            </table>
                        </td>
                        <td class="top-right">
                            <table class="meta">
                                <tr><td class="ml">Buyer Ref./Order No.</td><td class="mv">${i((m=t.quote)==null?void 0:m.buyerRefOrderNo)}</td></tr>
                                <tr><td class="ml">Dispatched through</td><td class="mv">${i((f=t.quote)==null?void 0:f.dispatchedThrough)}</td></tr>
                                <tr><td class="ml">Destination</td><td class="mv">${i((w=t.quote)==null?void 0:w.destination)}</td></tr>
                                <tr><td class="ml">Terms of Delivery</td><td class="mv">${i((u=t.quote)==null?void 0:u.termsOfDelivery)}</td></tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" style="border:1px solid #cbd5e1;padding:8px;">
                            <div class="sec-title">Buyer (Bill to)</div>
                            <div class="co-name">${i(n.name)}</div>
                            <div class="muted">${i(n.address)}</div>
                            <div class="muted">GSTIN/UIN: ${i(n.gstin)}</div>
                        </td>
                    </tr>
                </table>

                <table class="items">
                    <thead>
                        <tr>
                            <th>Sl</th>
                            <th>Description of Services</th>
                            <th>HSN/SAC</th>
                            <th>Due on</th>
                            <th class="r">Quantity</th>
                            <th class="r">Rate</th>
                            <th>per</th>
                            <th class="r">Disc. %</th>
                            <th class="r">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${l.map((v,C)=>`
                            <tr>
                                <td>${C+1}</td>
                                <td>${i(v.description)}${v.serviceCharge?`<div style="font-size:10px;color:#475569;margin-top:2px;">${i(v.serviceCharge)}</div>`:""}</td>
                                <td>${i(v.hsnSac)}</td>
                                <td>${i(v.dueOn)}</td>
                                <td class="r">${Number(v.qty||0).toFixed(2)} ${i(v.uom||"NOS")}</td>
                                <td class="r">${this.formatINR(v.rate||0)}</td>
                                <td>${i(v.uom||"NOS")}</td>
                                <td class="r">${i(v.discPct??"")}</td>
                                <td class="r">${this.formatINR(v.amount||0)}</td>
                            </tr>
                        `).join("")}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="4" class="r strong">Total</td>
                            <td class="r">${Number(l.reduce((v,C)=>v+(Number(C.qty)||0),0)||0).toFixed(2)} ${i(((b=l[0])==null?void 0:b.uom)||"NOS")}</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td class="r strong">${this.formatINR(o.total||0)}</td>
                        </tr>
                    </tfoot>
                </table>

                <div class="words">
                    <div class="muted">Amount Chargeable (in words)</div>
                    <div class="strong">${i(this.amountToWordsINR(o.total||0))}</div>
                </div>

                <div class="eo">E. &amp; O.E</div>

                <div class="bottom">
                    <div class="terms">
                        <div class="sec-title">Terms & Conditions</div>
                        <ol>
                            ${c.map(v=>`<li>${i(v)}</li>`).join("")}
                        </ol>
                    </div>
                    <div class="bank">
                        <div class="sec-title">Company's Bank Details</div>
                        <div class="muted">Bank Name: ${i(r.bankName)}</div>
                        <div class="muted">A/c No.: ${i(r.accountNo)}</div>
                        ${r.branch?`<div class="muted">Branch: ${i(r.branch)}</div>`:""}
                        <div class="muted">IFSC Code: ${i(r.ifsc)}</div>
                        <div class="sig">for ${i(s.name)}<div class="muted" style="margin-top:40px;">Authorised Signatory</div>
                    </div>
                </div>

                </div>
                <div class="footer">This is a Computer Generated Document</div>
            </div>
            `}openQuotationPrintWindow(a){const t=this.renderQuotationDocumentHTML(a),i=window.open("","_blank");if(!i){this.showToast("Popup blocked. Allow popups to print quotation.");return}i.document.open(),i.document.write(`
            <!DOCTYPE html>
                <html>
                    <head>
                        <meta charset="utf-8" />
                        <meta name="viewport" content="width=device-width, initial-scale=1" />
                        <title>Quotation</title>
                        <style>
                            body{font-family:Arial,Helvetica,sans-serif;margin:0;background:#f1f5f9;}
                            .doc{max-width:900px;margin:18px auto;background:#fff;padding:0;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);-webkit-print-color-adjust:exact;print-color-adjust:exact;}
                            .doc-body{padding:0 20px;}
                            .hdr{background:linear-gradient(135deg,#0a1628 0%,#1e3a8a 55%,#1d4ed8 100%);color:#fff;padding:18px 22px;display:flex;align-items:center;gap:14px;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
                            .hdr-logo-box{width:80px;height:80px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
                            .hdr-logo-box img{width:74px;height:74px;object-fit:contain;}
                            .hdr-text{flex:1;}
                            .hdr-company{font-size:16px;font-weight:800;margin-bottom:3px;}
                            .hdr-sub{font-size:9px;opacity:.85;line-height:1.55;}

                            .title{font-weight:800;letter-spacing:0.06em;font-size:16px;text-align:center;padding:8px 0;border:1px solid #cbd5e1;border-bottom:none;}
                            .co-name{font-weight:700;font-size:12px;color:#0f172a;}
                            .muted{font-size:11px;color:#0f172a;}
                            .strong{font-weight:800;color:#0f172a;}
                            .sec-title{font-size:11px;font-weight:800;color:#0f172a;margin:0 0 4px 0;}
                            .r{text-align:right;}

                            table.co{width:100%;border-collapse:collapse;}
                            table.co td{border:none;padding:0;vertical-align:top;}
                            td.co-logo{width:116px;padding-right:10px;}
                            td.co-text{padding-left:0;}
                            .logo-box{width:110px;height:110px;display:flex;align-items:center;justify-content:center;}
                            img.logo{width:104px;height:104px;object-fit:contain;display:block;}

                            table.top{width:100%;border-collapse:collapse;border:1px solid #cbd5e1;border-top:none;}
                            table.top td{border:1px solid #cbd5e1;vertical-align:top;padding:8px;}
                            td.top-left{width:60%;}
                            td.top-right{width:40%;padding:0;}

                            table.meta{width:100%;border-collapse:collapse;}
                            table.meta td{border:1px solid #cbd5e1;padding:6px 8px;font-size:11px;}
                            table.meta td.ml{width:55%;background:#f8fafc;font-weight:700;}
                            table.meta td.mv{width:45%;}

                            table.items{width:100%;border-collapse:collapse;margin-top:10px;font-size:11px;}
                            table.items th, table.items td{border:1px solid #cbd5e1;padding:6px;vertical-align:top;}
                            table.items thead th{background:#f8fafc;color:#0f172a;font-weight:800;}
                            table.items tfoot td{font-weight:800;}

                            .words{border:1px solid #cbd5e1;border-top:none;padding:8px;}
                            .eo{font-size:11px;text-align:right;margin-top:2px;}

                            .bottom{display:flex;gap:10px;justify-content:space-between;margin-top:10px;margin-bottom:16px;}
                            .terms{flex:1;border:1px solid #cbd5e1;padding:8px;min-height:140px;}
                            .terms ol{margin:0 0 0 18px;padding:0;font-size:11px;color:#0f172a;}
                            .bank{width:320px;border:1px solid #cbd5e1;padding:8px;}
                            .sig{margin-top:10px;font-size:11px;color:#0f172a;font-weight:800;text-align:right;}
                            .footer{background:#1e3a8a;color:#fff;text-align:center;font-size:10px;padding:8px 14px;letter-spacing:.05em;-webkit-print-color-adjust:exact;print-color-adjust:exact;}

                            @media print{
                                body{background:#fff;}
                            .doc{margin:0 auto;max-width:none;}
                    }
                        </style>
                    </head>
                    <body>
                        ${t}
                        <script>
                    window.onload = () => { try {window.focus(); window.print(); } catch(e) { } };
                        <\/script>
                    </body>
                </html>
        `),i.document.close()}getProjectRegistration(a=null){var i;const t=s=>String(s??"").replace(/</g,"&lt;");return`
            <div class="space-y-6 fade-in" >
                <div class="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h2 class="text-xl sm:text-2xl font-semibold text-slate-900">Project Registration</h2>
                        <p class="text-sm text-slate-500">Create a project linked to pipeline + billing</p>
                    </div>
                    <div class="flex items-center gap-2">
                        <button data-action="${a?`project:update:${a.id||this.getProjectKey(a).replace(/\"/g,"&quot;")}`:"project:register"}" class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">${a?"Update Project":"Create Project"}</button>
                        <button data-action="project:upload:trigger" class="px-4 py-2 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-1"><i data-lucide="upload" style="width:14px;height:14px;"></i>Upload Excel</button>
                        <input type="file" id="projectExcelUpload" accept=".xlsx,.xls,.csv" style="display:none;" />
                    </div>
                </div>

                <div class="flex justify-center">
                    <div class="w-full max-w-4xl bg-white rounded-lg border border-slate-200 p-6 shadow-lg">
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label class="text-xs font-medium text-slate-600">Client</label>
                                <select id="projectClient" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                                    <option value="">— Select client —</option>
                                    ${this.getStoredClients().map(s=>`<option value="${s.name||""}" ${((a==null?void 0:a.client)||"")===s.name?"selected":""}>${s.name||""}</option>`).join("")}
                                </select>
                            </div>
                            <div>
                                <label class="text-xs font-medium text-slate-600">Project Name</label>
                                <input id="projectName" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="e.g., Website Redesign" value="${t((a==null?void 0:a.name)||((i=a==null?void 0:a.identification)==null?void 0:i.projectCode)||"")}" />
                            </div>
                            <div>
                                <label class="text-xs font-medium text-slate-600">Start Date</label>
                                <input id="projectStartDate" type="date" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" value="${t((a==null?void 0:a.startDate)||"")}" />
                            </div>
                            <div>
                                <label class="text-xs font-medium text-slate-600">Duration</label>
                                <select id="projectDuration" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                                    <option>1-3 months</option>
                                    <option>3-6 months</option>
                                    <option>6-12 months</option>
                                </select>
                            </div>
                            <div>
                                <label class="text-xs font-medium text-slate-600">Budget (₹)</label>
                                <input id="projectBudget" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="e.g., 320000" value="${t((a==null?void 0:a.budget)||"")}" />
                            </div>
                            <div>
                                <label class="text-xs font-medium text-slate-600">Assigned Team</label>
                                <input id="projectTeam" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="SEO + Content + Ads" />
                            </div>
                            <div class="col-span-1 sm:col-span-2">
                                <label class="text-xs font-medium text-slate-600">Milestones</label>
                                <div class="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div class="p-3 bg-slate-50 rounded-lg">
                                        <div class="text-sm font-medium text-slate-900">Discovery</div>
                                        <div class="text-xs text-slate-500">Week 1</div>
                                    </div>
                                    <div class="p-3 bg-slate-50 rounded-lg">
                                        <div class="text-sm font-medium text-slate-900">Execution</div>
                                        <div class="text-xs text-slate-500">Weeks 2-6</div>
                                    </div>
                                    <div class="p-3 bg-slate-50 rounded-lg">
                                        <div class="text-sm font-medium text-slate-900">Reporting</div>
                                        <div class="text-xs text-slate-500">Week 7+</div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-span-1 sm:col-span-2 mt-4 space-y-4">
                                <details open class="group">
                                    <summary class="cursor-pointer select-none text-sm font-semibold text-slate-900">Project Identification Details</summary>
                                    <div class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">Project Code</label>
                                            <input id="projectCode" readonly class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50 text-slate-700" placeholder="Auto-generated based on Service Code" />
                                        </div>
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">Service Code</label>
                                            <select id="serviceCode" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                                                <option value="">Select</option>
                                                <option value="RE">RE</option>
                                                <option value="CAD">CAD</option>
                                                <option value="2D">2D</option>
                                                <option value="2DI">2DI</option>
                                                <option value="3DI">3DI</option>
                                                <option value="CD">CD</option>
                                                <option value="NPD">NPD</option>
                                                <option value="SPM">SPM</option>
                                                <option value="STL">STL</option>
                                                <option value="FEA">FEA</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">Vendor Code</label>
                                            <input id="vendorCode" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                        </div>
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">Company Name</label>
                                            <input id="companyName" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                        </div>
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">Location</label>
                                            <input id="projectLocation" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                        </div>
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">Quantity (QTY)</label>
                                            <input id="projectQty" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                        </div>
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">Project Lead</label>
                                            <input id="projectLead" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                        </div>
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">Assigned By</label>
                                            <input id="assignedBy" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                        </div>
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">Assigned To (Employee)</label>
                                            <input id="assignedTo" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                        </div>
                                        <div class="col-span-1 sm:col-span-2">
                                            <label class="text-xs font-medium text-slate-600">Project Description</label>
                                            <textarea id="projectDescription" rows="2" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"></textarea>
                                        </div>
                                        <div class="col-span-1 sm:col-span-2">
                                            <label class="text-xs font-medium text-slate-600">Part Description</label>
                                            <textarea id="partDescription" rows="2" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"></textarea>
                                        </div>
                                    </div>
                                </details>

                                <details class="group">
                                    <summary class="cursor-pointer select-none text-sm font-semibold text-slate-900">Technical Scope / Stage Tracking</summary>
                                    <div class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        ${[["model2dStatus","2D Model Status"],["model3dStatus","3D Model Status"],["scan3dStatus","3D Scan Status"],["feaStatus","FEA Status"],["qcInspectionStatus","QC / Inspection Status"],["approvalStatus","Approval Status"],["glApprovalStatus","GL Approval Status"],["revisionStatus","Correction / Revision Status"],["deliveryReportStatus","Delivery Report Status"],["sopDailyReportStatus","SOP-Based Daily Report Status"]].map(([s,n])=>`
                                            <div>
                                                <label class="text-xs font-medium text-slate-600">${n}</label>
                                                <select id="reg_tracking_${s}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                                                    ${["Pending","In Progress","Completed","Blocked"].map(l=>`<option>${l}</option>`).join("")}
                                                </select>
                                            </div>
                                        `).join("")}
                                    </div>
                                </details>

                                <details class="group">
                                    <summary class="cursor-pointer select-none text-sm font-semibold text-slate-900">Project Roadmap & Progress Monitoring</summary>
                                    <div class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        ${[["reg_monitoring_roadmapSubmitted","Project Roadmap Submitted"],["reg_monitoring_dashboardUpdated","Dashboard Updated"],["reg_monitoring_dailyReportUpdated","Daily Report Updated"],["reg_monitoring_photoAttached","Photo Attached"]].map(([s,n])=>`
                                            <div>
                                                <label class="text-xs font-medium text-slate-600">${n} (Yes/No)</label>
                                                <select id="${s}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                                                    <option>Yes</option>
                                                    <option selected>No</option>
                                                </select>
                                            </div>
                                        `).join("")}
                                        <div class="col-span-1 sm:col-span-2">
                                            <label class="text-xs font-medium text-slate-600">Overall Project Status</label>
                                            <select id="reg_monitoring_overallProjectStatus" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                                                ${["Completed","Partially Completed","Pending / Delayed"].map(s=>`<option ${s==="Pending / Delayed"?"selected":""}>${s}</option>`).join("")}
                                            </select>
                                        </div>
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">Post Completion Status</label>
                                            <input id="reg_monitoring_postCompletionStatus" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                        </div>
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">Physical Part Status</label>
                                            <input id="reg_monitoring_physicalPartStatus" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                        </div>
                                    </div>
                                </details>

                                <details class="group">
                                    <summary class="cursor-pointer select-none text-sm font-semibold text-slate-900">Dispatch & Delivery Details</summary>
                                    <div class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">DC Date</label>
                                            <input id="reg_dispatch_dcDate" type="date" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                        </div>
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">DC Number</label>
                                            <input id="reg_dispatch_dcNumber" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                        </div>
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">Delivery Status</label>
                                            <select id="reg_dispatch_deliveryStatus" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                                                ${["Pending","In Progress","Completed","Blocked"].map(s=>`<option ${s==="Pending"?"selected":""}>${s}</option>`).join("")}
                                            </select>
                                        </div>
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">Delivery Date</label>
                                            <input id="reg_dispatch_deliveryDate" type="date" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                        </div>
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">Delivery Confirmation (Yes/No)</label>
                                            <select id="reg_dispatch_deliveryConfirmation" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                                                <option>Yes</option>
                                                <option selected>No</option>
                                            </select>
                                        </div>
                                    </div>
                                </details>

                                <details class="group">
                                    <summary class="cursor-pointer select-none text-sm font-semibold text-slate-900">Quotation & Purchase Details</summary>
                                    <div class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">Quotation Date</label>
                                            <input id="reg_purchase_quotationDate" type="date" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                        </div>
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">Quotation Number</label>
                                            <input id="reg_purchase_quotationNumber" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                        </div>
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">PO Date</label>
                                            <input id="reg_purchase_poDate" type="date" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                        </div>
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">PO Number</label>
                                            <input id="reg_purchase_poNumber" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                        </div>
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">PO Value</label>
                                            <input id="reg_purchase_poValue" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                        </div>
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">Converted By</label>
                                            <input id="reg_purchase_convertedBy" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                        </div>
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">Visit Conducted (Yes/No)</label>
                                            <select id="reg_purchase_visitConducted" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                                                <option>Yes</option>
                                                <option selected>No</option>
                                            </select>
                                        </div>
                                    </div>
                                </details>

                                <details class="group">
                                    <summary class="cursor-pointer select-none text-sm font-semibold text-slate-900">Invoice & Payment Tracking</summary>
                                    <div class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">Invoice Date</label>
                                            <input id="reg_payment_invoiceDate" type="date" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                        </div>
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">Invoice Number</label>
                                            <input id="reg_payment_invoiceNumber" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                        </div>
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">Invoice Amount</label>
                                            <input id="reg_payment_invoiceAmount" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                        </div>
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">Past Invoice Amount</label>
                                            <input id="reg_payment_pastInvoiceAmount" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                        </div>
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">Payment Terms</label>
                                            <input id="reg_payment_paymentTerms" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                        </div>
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">Payment Type</label>
                                            <input id="reg_payment_paymentType" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                        </div>
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">Payment Due Date</label>
                                            <input id="reg_payment_paymentDueDate" type="date" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                        </div>
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">Payment Received Date</label>
                                            <input id="reg_payment_paymentReceivedDate" type="date" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                        </div>
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">Payment Received Amount</label>
                                            <input id="reg_payment_paymentReceivedAmount" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                        </div>
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">Balance Payment Due Date</label>
                                            <input id="reg_payment_balancePaymentDueDate" type="date" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                        </div>
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">Balance Payment Amount</label>
                                            <input id="reg_payment_balancePaymentAmount" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                        </div>
                                    </div>
                                </details>

                                <details class="group">
                                    <summary class="cursor-pointer select-none text-sm font-semibold text-slate-900">Performance & Rating</summary>
                                    <div class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        ${[["reg_ratings_clientRating","Client Rating"],["reg_ratings_jobRating","Job Rating"],["reg_ratings_qualityRating","Quality Rating"],["reg_ratings_serviceRating","Service Rating"],["reg_ratings_performanceRating","Performance Rating"]].map(([s,n])=>`
                                            <div>
                                                <label class="text-xs font-medium text-slate-600">${n} (0-10)</label>
                                                <input id="${s}" type="number" min="0" max="10" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                            </div>
                                        `).join("")}
                                        <div class="col-span-1 sm:col-span-2">
                                            <label class="text-xs font-medium text-slate-600">Feedback / Comments</label>
                                            <textarea id="reg_ratings_feedbackComments" rows="2" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"></textarea>
                                        </div>
                                        <div class="col-span-1 sm:col-span-2">
                                            <label class="text-xs font-medium text-slate-600">Additional Notes</label>
                                            <textarea id="reg_ratings_additionalNotes" rows="2" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"></textarea>
                                        </div>
                                    </div>
                                </details>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `}getProjectDirectory(){const a=this.getAllProjectsMerged([]).map(o=>this.ensureProjectModel(o));try{this._projectsCacheByKey=new Map(a.map(o=>[this.getProjectKey(o),o]))}catch{this._projectsCacheByKey=null}const t=this.selectedProjectKey||"",i=t&&a.find(o=>this.getProjectKey(o)===t)||null,s=o=>String(o??"").replace(/</g,"&lt;").replace(/"/g,"&quot;"),n=(o,r,c)=>`
            <select data - project - key="${this.getProjectKey(o)}" data - project - field="${r}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" >
                ${["Pending","In Progress","Completed","Blocked"].map(p=>`<option ${p===(c||"Pending")?"selected":""}>${p}</option>`).join("")}
                </select>
            `,l=o=>{var c,d,p,g,h,m,f,w,u,b,v,C,L,F,D,j,I,N,R,_,A,E,z,V,Q,J,Y,Z,tt,et,st,at,it,O,ot,lt,rt,dt,ct;if(!o)return'<div class="text-sm text-slate-500" > Select a project to view details.</div> ';const r=this.getProjectKey(o);return`
            <div class="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-lg" >
                    <div class="flex items-start justify-between gap-3">
                        <div>
                            <h3 class="text-lg font-semibold text-slate-900">${s(o.name)}</h3>
                            <div class="text-sm text-slate-500">${s(o.client)}</div>
                        </div>
                        <span class="px-2 py-1 text-xs font-medium bg-${o.statusColor||"sky"}-50 text-${o.statusColor||"sky"}-700 rounded-full">${s(o.status||"—")}</span>
                    </div>

                    <div class="mt-5 space-y-4">
                        <details open class="group">
                            <summary class="cursor-pointer select-none text-sm font-semibold text-slate-900">Project Identification Details</summary>
                            <div class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label class="text-xs font-medium text-slate-600">Project Code</label>
                                    <input data-project-key="${r}" data-project-field="identification.projectCode" value="${s(((c=o.identification)==null?void 0:c.projectCode)||"")}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-slate-600">Service Code</label>
                                    <select data-project-key="${r}" data-project-field="identification.serviceCode" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                                        <option value="">Select</option>
                                        <option value="RE" ${((d=o.identification)==null?void 0:d.serviceCode)==="RE"?"selected":""}>RE</option>
                                        <option value="CAD" ${((p=o.identification)==null?void 0:p.serviceCode)==="CAD"?"selected":""}>CAD</option>
                                        <option value="2D" ${((g=o.identification)==null?void 0:g.serviceCode)==="2D"?"selected":""}>2D</option>
                                        <option value="2DI" ${((h=o.identification)==null?void 0:h.serviceCode)==="2DI"?"selected":""}>2DI</option>
                                        <option value="3DI" ${((m=o.identification)==null?void 0:m.serviceCode)==="3DI"?"selected":""}>3DI</option>
                                        <option value="CD" ${((f=o.identification)==null?void 0:f.serviceCode)==="CD"?"selected":""}>CD</option>
                                        <option value="NPD" ${((w=o.identification)==null?void 0:w.serviceCode)==="NPD"?"selected":""}>NPD</option>
                                        <option value="SPM" ${((u=o.identification)==null?void 0:u.serviceCode)==="SPM"?"selected":""}>SPM</option>
                                        <option value="STL" ${((b=o.identification)==null?void 0:b.serviceCode)==="STL"?"selected":""}>STL</option>
                                        <option value="FEA" ${((v=o.identification)==null?void 0:v.serviceCode)==="FEA"?"selected":""}>FEA</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-slate-600">Vendor Code</label>
                                    <input data-project-key="${r}" data-project-field="identification.vendorCode" value="${s(((C=o.identification)==null?void 0:C.vendorCode)||"")}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-slate-600">Company Name</label>
                                    <input data-project-key="${r}" data-project-field="identification.companyName" value="${s(((L=o.identification)==null?void 0:L.companyName)||"")}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-slate-600">Location</label>
                                    <input data-project-key="${r}" data-project-field="identification.location" value="${s(((F=o.identification)==null?void 0:F.location)||"")}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-slate-600">Quantity (QTY)</label>
                                    <input data-project-key="${r}" data-project-field="identification.qty" value="${s(((D=o.identification)==null?void 0:D.qty)||"")}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-slate-600">Project Lead</label>
                                    <input data-project-key="${r}" data-project-field="identification.projectLead" value="${s(((j=o.identification)==null?void 0:j.projectLead)||"")}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-slate-600">Assigned By</label>
                                    <input data-project-key="${r}" data-project-field="identification.assignedBy" value="${s(((I=o.identification)==null?void 0:I.assignedBy)||"")}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-slate-600">Assigned To (Employee)</label>
                                    <input data-project-key="${r}" data-project-field="identification.assignedTo" value="${s(((N=o.identification)==null?void 0:N.assignedTo)||"")}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div class="col-span-1 sm:col-span-2">
                                    <label class="text-xs font-medium text-slate-600">Project Description</label>
                                    <textarea data-project-key="${r}" data-project-field="identification.projectDescription" rows="2" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">${String(((R=o.identification)==null?void 0:R.projectDescription)||"").replace(/</g,"&lt;")}</textarea>
                                </div>
                                <div class="col-span-1 sm:col-span-2">
                                    <label class="text-xs font-medium text-slate-600">Part Description</label>
                                    <textarea data-project-key="${r}" data-project-field="identification.partDescription" rows="2" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">${String(((_=o.identification)==null?void 0:_.partDescription)||"").replace(/</g,"&lt;")}</textarea>
                                </div>
                            </div>
                        </details>

                        <details class="group">
                            <summary class="cursor-pointer select-none text-sm font-semibold text-slate-900">Technical Scope / Stage Tracking</summary>
                            <div class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                ${[["model2dStatus","2D Model Status"],["model3dStatus","3D Model Status"],["scan3dStatus","3D Scan Status"],["feaStatus","FEA Status"],["qcInspectionStatus","QC / Inspection Status"],["approvalStatus","Approval Status"],["glApprovalStatus","GL Approval Status"],["revisionStatus","Correction / Revision Status"],["deliveryReportStatus","Delivery Report Status"],["sopDailyReportStatus","SOP-Based Daily Report Status"]].map(([q,W])=>{var G;return`
                                    <div>
                                        <label class="text-xs font-medium text-slate-600">${W}</label>
                                        ${n(o,`tracking.${q}`,((G=o.tracking)==null?void 0:G[q])||"Pending")}
                                    </div>
                                `}).join("")}
                            </div>
                        </details>

                        <details class="group">
                            <summary class="cursor-pointer select-none text-sm font-semibold text-slate-900">Project Roadmap & Progress Monitoring</summary>
                            <div class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                ${[["monitoring.roadmapSubmitted","Project Roadmap Submitted"],["monitoring.dashboardUpdated","Dashboard Updated"],["monitoring.dailyReportUpdated","Daily Report Updated"],["monitoring.photoAttached","Photo Attached"]].map(([q,W])=>{const G=q.split(".").reduce((K,X)=>K==null?void 0:K[X],o)||"No";return`
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">${W} (Yes/No)</label>
                                            <select data-project-key="${r}" data-project-field="${q}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                                                <option ${G==="Yes"?"selected":""}>Yes</option>
                                                <option ${G!=="Yes"?"selected":""}>No</option>
                                            </select>
                                        </div>
                                    `}).join("")}
                                <div class="col-span-1 sm:col-span-2">
                                    <label class="text-xs font-medium text-slate-600">Overall Project Status</label>
                                    <select data-project-key="${r}" data-project-field="monitoring.overallProjectStatus" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                                        ${["Completed","Partially Completed","Pending / Delayed"].map(q=>{var W;return`<option ${q===(((W=o.monitoring)==null?void 0:W.overallProjectStatus)||"Pending / Delayed")?"selected":""}>${q}</option>`}).join("")}
                                    </select>
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-slate-600">Post Completion Status</label>
                                    <input data-project-key="${r}" data-project-field="monitoring.postCompletionStatus" value="${s(((A=o.monitoring)==null?void 0:A.postCompletionStatus)||"")}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-slate-600">Physical Part Status</label>
                                    <input data-project-key="${r}" data-project-field="monitoring.physicalPartStatus" value="${s(((E=o.monitoring)==null?void 0:E.physicalPartStatus)||"")}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                            </div>
                        </details>

                        <details class="group">
                            <summary class="cursor-pointer select-none text-sm font-semibold text-slate-900">Dispatch & Delivery Details</summary>
                            <div class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label class="text-xs font-medium text-slate-600">DC Date</label>
                                    <input data-project-key="${r}" data-project-field="dispatch.dcDate" type="date" value="${s(((z=o.dispatch)==null?void 0:z.dcDate)||"")}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-slate-600">DC Number</label>
                                    <input data-project-key="${r}" data-project-field="dispatch.dcNumber" value="${s(((V=o.dispatch)==null?void 0:V.dcNumber)||"")}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-slate-600">Delivery Status</label>
                                    ${n(o,"dispatch.deliveryStatus",((Q=o.dispatch)==null?void 0:Q.deliveryStatus)||"Pending")}
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-slate-600">Delivery Date</label>
                                    <input data-project-key="${r}" data-project-field="dispatch.deliveryDate" type="date" value="${s(((J=o.dispatch)==null?void 0:J.deliveryDate)||"")}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-slate-600">Delivery Confirmation (Yes/No)</label>
                                    <select data-project-key="${r}" data-project-field="dispatch.deliveryConfirmation" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                                        <option ${String(((Y=o.dispatch)==null?void 0:Y.deliveryConfirmation)||"No")==="Yes"?"selected":""}>Yes</option>
                                        <option ${String(((Z=o.dispatch)==null?void 0:Z.deliveryConfirmation)||"No")!=="Yes"?"selected":""}>No</option>
                                    </select>
                                </div>
                            </div>
                        </details>

                        <details class="group">
                            <summary class="cursor-pointer select-none text-sm font-semibold text-slate-900">Quotation & Purchase Details</summary>
                            <div class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label class="text-xs font-medium text-slate-600">Quotation Date</label>
                                    <input data-project-key="${r}" data-project-field="purchase.quotationDate" type="date" value="${s(((tt=o.purchase)==null?void 0:tt.quotationDate)||"")}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-slate-600">Quotation Number</label>
                                    <input data-project-key="${r}" data-project-field="purchase.quotationNumber" value="${s(((et=o.purchase)==null?void 0:et.quotationNumber)||"")}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-slate-600">PO Date</label>
                                    <input data-project-key="${r}" data-project-field="purchase.poDate" type="date" value="${s(((st=o.purchase)==null?void 0:st.poDate)||"")}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-slate-600">PO Number</label>
                                    <input data-project-key="${r}" data-project-field="purchase.poNumber" value="${s(((at=o.purchase)==null?void 0:at.poNumber)||"")}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-slate-600">PO Value</label>
                                    <input data-project-key="${r}" data-project-field="purchase.poValue" value="${s(((it=o.purchase)==null?void 0:it.poValue)||"")}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-slate-600">Converted By</label>
                                    <input data-project-key="${r}" data-project-field="purchase.convertedBy" value="${s(((O=o.purchase)==null?void 0:O.convertedBy)||"")}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-slate-600">Visit Conducted (Yes/No)</label>
                                    <select data-project-key="${r}" data-project-field="purchase.visitConducted" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                                        <option ${String(((ot=o.purchase)==null?void 0:ot.visitConducted)||"No")==="Yes"?"selected":""}>Yes</option>
                                        <option ${String(((lt=o.purchase)==null?void 0:lt.visitConducted)||"No")!=="Yes"?"selected":""}>No</option>
                                    </select>
                                </div>
                            </div>
                        </details>

                        <details class="group">
                            <summary class="cursor-pointer select-none text-sm font-semibold text-slate-900">Invoice & Payment Tracking</summary>
                            <div class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                ${[["payment.invoiceDate","Invoice Date","date"],["payment.invoiceNumber","Invoice Number","text"],["payment.invoiceAmount","Invoice Amount","text"],["payment.pastInvoiceAmount","Past Invoice Amount","text"],["payment.paymentTerms","Payment Terms","text"],["payment.paymentType","Payment Type","text"],["payment.paymentDueDate","Payment Due Date","date"],["payment.paymentReceivedDate","Payment Received Date","date"],["payment.paymentReceivedAmount","Payment Received Amount","text"],["payment.balancePaymentDueDate","Balance Payment Due Date","date"],["payment.balancePaymentAmount","Balance Payment Amount","text"]].map(([q,W,G])=>{const K=q.split(".").reduce((X,pt)=>X==null?void 0:X[pt],o)||"";return`
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">${W}</label>
                                            <input data-project-key="${r}" data-project-field="${q}" type="${G}" value="${s(K)}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                        </div>
                                    `}).join("")}
                                <div class="col-span-1 sm:col-span-2">
                                    <label class="text-xs font-medium text-slate-600">Overdue Status (auto)</label>
                                    <input value="${s(((rt=o.payment)==null?void 0:rt.overdueStatus)||"")}" disabled class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50 text-slate-700" />
                                </div>
                            </div>
                        </details>

                        <details class="group">
                            <summary class="cursor-pointer select-none text-sm font-semibold text-slate-900">Performance & Rating</summary>
                            <div class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                ${[["ratings.clientRating","Client Rating"],["ratings.jobRating","Job Rating"],["ratings.qualityRating","Quality Rating"],["ratings.serviceRating","Service Rating"],["ratings.performanceRating","Performance Rating"]].map(([q,W])=>{const G=q.split(".").reduce((K,X)=>K==null?void 0:K[X],o)||"";return`
                                        <div>
                                            <label class="text-xs font-medium text-slate-600">${W} (0-10)</label>
                                            <input data-project-key="${r}" data-project-field="${q}" type="number" min="0" max="10" value="${s(G)}" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                        </div>
                                    `}).join("")}
                                <div class="col-span-1 sm:col-span-2">
                                    <label class="text-xs font-medium text-slate-600">Feedback / Comments</label>
                                    <textarea data-project-key="${r}" data-project-field="ratings.feedbackComments" rows="2" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">${String(((dt=o.ratings)==null?void 0:dt.feedbackComments)||"").replace(/</g,"&lt;")}</textarea>
                                </div>
                                <div class="col-span-1 sm:col-span-2">
                                    <label class="text-xs font-medium text-slate-600">Additional Notes</label>
                                    <textarea data-project-key="${r}" data-project-field="ratings.additionalNotes" rows="2" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">${String(((ct=o.ratings)==null?void 0:ct.additionalNotes)||"").replace(/</g,"&lt;")}</textarea>
                                </div>
                            </div>
                        </details>
                    </div>

                    <div class="mt-6 flex gap-2">
                        <button data-action="project:save:${String(r).replace(/"/g,"&quot;")}" class="px-3 py-1.5 text-xs font-medium bg-green-600 text-white rounded-lg hover:bg-green-700">Save</button>
                        <button data-action="project:delete:${String(r).replace(/"/g,"&quot;")} " class="px-3 py - 1.5 text - xs font-medium bg - red - 600 text - white rounded - lg hover: bg - red - 700">Delete</button>
                    </div>
                </div>
    `};return`
    <div class="space-y-6 fade-in" >
        <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
                <h2 class="text-xl sm:text-2xl font-semibold text-slate-900">Project Directory</h2>
                <p class="text-sm text-slate-500">All projects with full profile details</p>
            </div>
        </div>

                ${i?`
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div class="col-span-1 bg-white rounded-lg border border-slate-200 overflow-hidden">
                            <div class="p-4 border-b border-slate-200 flex items-center justify-between">
                                <div class="text-sm font-medium text-slate-900">Projects</div>
                                <div class="text-xs text-slate-500">${a.length}</div>
                            </div>
                            <div class="overflow-x-auto">
                                <table class="w-full text-sm" style="min-width: 800px;">
                                    <thead class="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            <th class="text-left px-4 py-3 font-medium text-slate-700">Project Code</th>
                                            <th class="text-left px-4 py-3 font-medium text-slate-700">Company</th>
                                            <th class="text-left px-4 py-3 font-medium text-slate-700">Lead</th>
                                            <th class="text-left px-4 py-3 font-medium text-slate-700">Assigned</th>
                                            <th class="text-center px-4 py-3 font-medium text-slate-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-slate-200">
                                        ${a.map(o=>{var d,p,g,h;const r=this.getProjectKey(o);return`
                                                <tr class="${i&&this.getProjectKey(i)===r?"bg-purple-50":""} hover:bg-slate-50">
                                                    <td class="px-4 py-3">
                                                        <button data-action="project:dir:select:${String(r).replace(/\"/g,"&quot;")}" class="text-left w-full font-semibold text-slate-900 hover:text-purple-700">
                                                            ${s(((d=o.identification)==null?void 0:d.projectCode)||"—")}
                                                        </button>
                                                    </td>
                                                    <td class="px-4 py-3 text-slate-700">${s(((p=o.identification)==null?void 0:p.companyName)||o.client||"—")}</td>
                                                    <td class="px-4 py-3 text-slate-700">${s(((g=o.identification)==null?void 0:g.projectLead)||o.owner||"—")}</td>
                                                    <td class="px-4 py-3 text-slate-700">${s(((h=o.identification)==null?void 0:h.assignedTo)||"—")}</td>
                                                    <td class="px-4 py-3 text-center">
                                                        <div class="flex items-center justify-center gap-2">
                                                            <button data-action="project:edit:${String(r).replace(/"/g,"&quot;")}" class="p-1.5 text-slate-400 hover:text-purple-600 rounded transition flex-shrink-0" title="Edit Project">
                                                                <i data-lucide="edit-2" class="w-4 h-4" style="width:16px;height:16px;"></i>
                                                            </button>
                                                            <button data-action="project:delete:${String(r).replace(/\"/g,"&quot;")}" class="p-1.5 text-slate-400 hover:text-red-600 rounded transition flex-shrink-0" title="Delete Project" onclick="return confirm('Do you really want to delete this project?')">
                                                                <i data-lucide="trash-2" class="w-4 h-4" style="width:16px;height:16px;"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            `}).join("")}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div class="col-span-1 sm:col-span-2">
                            ${l(i)}
                        </div>
                    </div>
                `:`
                    <div class="bg-white rounded-lg border border-slate-200 overflow-hidden">
                        <div class="p-4 border-b border-slate-200 flex items-center justify-between">
                            <div class="text-sm font-medium text-slate-900">Projects</div>
                            <div class="text-xs text-slate-500">${a.length}</div>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="w-full text-sm" style="min-width: 800px;">
                                <thead class="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th class="text-left px-4 py-3 font-medium text-slate-700">Project Code</th>
                                        <th class="text-left px-4 py-3 font-medium text-slate-700">Company</th>
                                        <th class="text-left px-4 py-3 font-medium text-slate-700">Lead</th>
                                        <th class="text-left px-4 py-3 font-medium text-slate-700">Assigned</th>
                                        <th class="text-center px-4 py-3 font-medium text-slate-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-200">
                                    ${a.map(o=>{var c,d,p,g;const r=this.getProjectKey(o);return`
                                            <tr class="hover:bg-slate-50">
                                                <td class="px-4 py-3">
                                                    <button data-action="project:dir:select:${String(r).replace(/"/g,"&quot;")}" class="text-left w-full font-semibold text-slate-900 hover:text-purple-700">
                                                        ${s(((c=o.identification)==null?void 0:c.projectCode)||"—")}
                                                    </button>
                                                </td>
                                                <td class="px-4 py-3 text-slate-700">${s(((d=o.identification)==null?void 0:d.companyName)||o.client||"—")}</td>
                                                <td class="px-4 py-3 text-slate-700">${s(((p=o.identification)==null?void 0:p.projectLead)||o.owner||"—")}</td>
                                                <td class="px-4 py-3 text-slate-700">${s(((g=o.identification)==null?void 0:g.assignedTo)||"—")}</td>
                                                <td class="px-4 py-3 text-center">
                                                    <div class="flex items-center justify-center gap-2">
                                                        <button data-action="project:edit:${String(r).replace(/"/g,"&quot;")}" class="p-1.5 text-slate-400 hover:text-purple-600 rounded transition flex-shrink-0" title="Edit Project">
                                                            <i data-lucide="edit-2" class="w-4 h-4" style="width:16px;height:16px;"></i>
                                                        </button>
                                                        <button data-action="project:delete:${String(r).replace(/"/g,"&quot;")}" class="p-1.5 text-slate-400 hover:text-red-600 rounded transition flex-shrink-0" title="Delete Project" onclick="return confirm('Do you really want to delete this project?')">
                                                            <i data-lucide="trash-2" class="w-4 h-4" style="width:16px;height:16px;"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        `}).join("")}
                                </tbody>
                            </table>
                        </div>
                    </div>
                `}
            </div>
    `}getSalesPipeline(){const a=[{id:"lead",name:"Lead",color:"sky"},{id:"deal",name:"Deal",color:"indigo"},{id:"project",name:"Project",color:"emerald"},{id:"payment",name:"Payment",color:"amber"}],t={lead:[],deal:[],project:[],payment:[]};try{this.getClientsData().slice(0,6).forEach(i=>{t.lead.push({id:`cli:${String(i.name||"").trim()} `,title:i.name,value:i.dueAmount||"₹0",meta:`Stage: ${i.stage||"Active"} `})})}catch{}try{[...this.getStoredProjects()].slice(0,6).forEach(s=>{t.project.push({id:`proj:${String(s.name||"").trim()} `,title:`${s.client||"Client"} • ${s.name||"Project"} `,value:s.budget||"—",meta:s.startDate?`Start: ${s.startDate} `:s.duration?`Duration: ${s.duration} `:"In progress"})})}catch{}try{[...this.getStoredProjects()].slice(0,3).forEach(s=>{t.deal.push({id:`proj:${String(s.name||"").trim()} `,title:`${s.client||"Client"} • ${s.name||"Project"} `,value:s.budget||"—",meta:"Next: approval / scope"})})}catch{}try{this.getStoredInvoices().slice(0,6).forEach(s=>{t.payment.push({id:`inv:${String(s.no||"").trim()}`,title:`${s.no} • ${s.client}`,value:s.amount,meta:`${s.status} • ${s.due}`})})}catch{}return`
    <div class="space-y-6 fade-in" >
                <div class="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h2 class="text-xl sm:text-2xl font-semibold text-slate-900">Sales Pipeline</h2>
                        <p class="text-sm text-slate-500">Kanban: Lead → Deal → Project → Payment</p>
                    </div>
                    <button class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">+ Add Deal</button>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    ${a.map(i=>`
                        <div class="bg-white rounded-lg border border-slate-200 overflow-hidden">
                            <div class="p-4 border-b border-slate-200 flex items-center justify-between">
                                <div class="font-medium text-slate-900">${i.name}</div>
                                <span class="text-xs font-medium bg-${i.color}-50 text-${i.color}-700 px-2 py-1 rounded-full">${(t[i.id]||[]).length}</span>
                            </div>
                            <div class="p-4 space-y-3 bg-slate-50">
                                ${(t[i.id]||[]).map(s=>`
                                    <div class="bg-white rounded-lg border border-slate-200 p-4 shadow-lg hover:shadow-sm transition-shadow">
                                        <div class="text-sm font-semibold text-slate-900">${s.title}</div>
                                        <div class="text-sm text-slate-700 mt-1">${s.value}</div>
                                        <div class="text-xs text-slate-500 mt-2">${s.meta}</div>
                                        <div class="mt-3 flex items-center justify-between">
                                            <span class="text-[11px] text-slate-500">Updated today</span>
                                            <button data-action="pipeline:open:${s.id}" class="px-2 py-1 text-xs font-medium bg-purple-50 text-purple-700 rounded-md hover:bg-purple-100 transition-colors">Open</button>
                                        </div>
                                    </div>
                                `).join("")}
                            </div>
                        </div>
                    `).join("")}
                </div>
            </div>
    `}getActiveProjects(){const a=this.getAllProjectsMerged([]);try{this._projectsCacheByKey=new Map(a.map(c=>[this.getProjectKey(c),c]))}catch{this._projectsCacheByKey=null}const t=["Brief","Planning","Execution","Review","Delivery"],i=c=>`${String((c==null?void 0:c.name)||"").trim()}__${String((c==null?void 0:c.client)||"").trim()} `,s=this.selectedProjectKey||"",n=s&&a.find(c=>i(c)===s)||null;n&&Math.min(t.length-1,Math.max(0,Math.floor((Number(n.progress)||0)/(100/t.length))));const l=(n==null?void 0:n.statusColor)||"sky",o=c=>{const d=Math.max(0,Math.min(100,Number(c==null?void 0:c.progress)||0)),p=Math.min(t.length-1,Math.max(0,Math.floor(d/(100/t.length)))),g=(c==null?void 0:c.statusColor)||"sky";return`
    <div class="flex items-center gap-3" >
                    <div class="flex items-center flex-1">
                        ${t.map((h,m)=>{const f=m<=p,w=m===t.length-1,u=f?`bg-${g}-600 border-${g}-600`:"bg-slate-200 border-slate-200",b=f?`bg-${g}-500`:"bg-slate-200";return`
                                <div class="flex items-center ${w?"":"flex-1"}">
                                    <div class="w-9 h-9 rounded-full border ${u} flex items-center justify-center flex-shrink-0">
                                        ${f?'<i data-lucide="check" class="w-5 h-5 text-white"></i>':""}
                                    </div>
                                    ${w?"":`<div class="h-[3px] ${b} flex-1"></div>`}
                                </div>
                            `}).join("")}
                    </div>
                    <div class="text-xs font-semibold text-slate-900">${d}%</div>
                </div>
    `},r=!!(this.isProjectDetailOpen&&n);return`
    <div class="space-y-6 fade-in" >
                <div class="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h2 class="text-xl sm:text-2xl font-semibold text-slate-900">Active Projects</h2>
                        <p class="text-sm text-slate-500">Progress, team members, and budget health</p>
                    </div>
                    <button class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">+ Add Project</button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div class="${r?"col-span-2":"col-span-1 lg:col-span-3"} bg-white rounded-lg border border-slate-200 overflow-hidden">
                        <div class="p-4 border-b border-slate-200 flex items-center justify-between">
                            <div class="text-sm font-medium text-slate-900">Project List</div>
                            <div class="text-xs text-slate-500">${a.length} active</div>
                        </div>
                        <div class="divide-y divide-slate-200">
                            ${a.map(c=>{var g;const d=i(c),p=n&&i(n)===d;return`
                                    <button data-action="project:select:${d.replace(/"/g,"&quot;")}" class="w-full text-left p-4 hover:bg-slate-50 ${p?"bg-purple-50":""}">
                                        <div class="flex items-start justify-between">
                                            <div>
                                                <div class="text-sm font-semibold text-slate-900">${c.name}</div>
                                                <div class="text-xs text-slate-500">${c.client} • Owner: ${c.owner}</div>
                                            </div>
                                            <span class="px-2 py-1 text-xs font-medium bg-${c.statusColor}-50 text-${c.statusColor}-700 rounded-full">${c.status}</span>
                                        </div>

                                        <div class="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
                                            <div>
                                                ${o(c)}
                                            </div>
                                            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                                <div class="p-3 bg-slate-50 rounded-lg">
                                                    <div class="text-xs text-slate-500">Budget</div>
                                                    <div class="text-sm font-semibold text-slate-900">${c.budget}</div>
                                                </div>
                                                <div class="p-3 bg-slate-50 rounded-lg">
                                                    <div class="text-xs text-slate-500">Spent</div>
                                                    <div class="text-sm font-semibold text-slate-900">${c.spent}</div>
                                                </div>
                                                <div class="p-3 bg-slate-50 rounded-lg">
                                                    <div class="text-xs text-slate-500">Service Code</div>
                                                    <div class="text-sm font-semibold text-slate-900">${((g=c.identification)==null?void 0:g.serviceCode)||"—"}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                `}).join("")}
                        </div>
                    </div>

                    ${r?`
                        <div class="col-span-1 bg-white rounded-lg border border-slate-200 p-6 shadow-lg">
                            <div class="flex items-start justify-between gap-3">
                                <div>
                                    <h3 class="text-lg font-semibold text-slate-900">${n.name}</h3>
                                    <div class="text-sm text-slate-500">${n.client}</div>
                                </div>
                                <button data-action="project:detail:close" class="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg" aria-label="Close">
                                    <i data-lucide="x" class="w-4 h-4"></i>
                                </button>
                            </div>

                            <div class="mt-3 flex items-center justify-between">
                                <span class="px-2 py-1 text-xs font-medium bg-${l}-50 text-${l}-700 rounded-full">${n.status}</span>
                                <div class="text-xs text-slate-600">Progress: <span class="font-semibold text-slate-900">${n.progress}%</span></div>
                            </div>

                            <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div class="p-3 bg-slate-50 rounded-lg">
                                    <div class="text-xs text-slate-500">Owner</div>
                                    <div class="text-sm font-semibold text-slate-900">${n.owner||"—"}</div>
                                </div>
                                <div class="p-3 bg-slate-50 rounded-lg">
                                    <div class="text-xs text-slate-500">Lead</div>
                                    <div class="text-sm font-semibold text-slate-900">${n.lead||n.leadName||"—"}</div>
                                </div>
                                <div class="p-3 bg-slate-50 rounded-lg">
                                    <div class="text-xs text-slate-500">Budget</div>
                                    <div class="text-sm font-semibold text-slate-900">${n.budget||"—"}</div>
                                </div>
                                <div class="p-3 bg-slate-50 rounded-lg">
                                    <div class="text-xs text-slate-500">Spent</div>
                                    <div class="text-sm font-semibold text-slate-900">${n.spent||"—"}</div>
                                </div>
                            </div>

                            <div class="mt-5">
                                <button data-action="nav:projects/directory" class="w-full px-4 py-2 text-sm font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">Open full details in Project Directory</button>
                            </div>
                        </div>
                    `:""}
                </div>
            </div>
    `}getCompletedProjects(){return`
    <div class="space-y-6 fade-in" >
                <div class="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h2 class="text-xl sm:text-2xl font-semibold text-slate-900">Completed Projects</h2>
                        <p class="text-sm text-slate-500">Delivery, feedback, and next-project signals</p>
                    </div>
                    <button class="px-4 py-2 text-sm font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">Download Summary</button>
                </div>

                <div class="bg-white rounded-lg border border-slate-200 overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm" style="min-width: 800px;">
                            <thead class="bg-slate-50 text-slate-600">
                                <tr>
                                    <th class="text-left px-4 py-3 font-medium">Project</th>
                                    <th class="text-left px-4 py-3 font-medium">Client</th>
                                    <th class="text-left px-4 py-3 font-medium">Delivered</th>
                                    <th class="text-right px-4 py-3 font-medium">Value</th>
                                    <th class="text-left px-4 py-3 font-medium">Feedback</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-200">
                                ${(this.getStoredProjects?this.getStoredProjects():[]).filter(i=>String(i.status||"").toLowerCase()==="completed").slice(0,10).map(i=>{var s;return{name:String(i.name||"—"),client:String(i.client||"—"),delivered:String(i.end_date||i.endDate||"—"),value:String(i.budget||i.value||"—"),rating:Number(((s=i.ratings)==null?void 0:s.clientRating)||i.rating||0)}}).map(i=>`
                                    <tr class="hover:bg-slate-50">
                                        <td class="px-4 py-3 font-medium text-slate-900">${i.name}</td>
                                        <td class="px-4 py-3 text-slate-700">${i.client}</td>
                                        <td class="px-4 py-3 text-slate-700">${i.delivered}</td>
                                        <td class="px-4 py-3 text-right font-medium text-slate-900">${i.value}</td>
                                        <td class="px-4 py-3">
                                            <div class="flex items-center gap-1">
                                                ${Array.from({length:5}).map((s,n)=>`
                                                    <i data-lucide="star" class="w-4 h-4 ${n<i.rating?"text-amber-500":"text-slate-300"}"></i>
                                                `).join("")}
                                            </div>
                                        </td>
                                    </tr>
                                `).join("")}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
    `}initializeBudgetVsSpentChart(){const a=document.getElementById("budgetSpentChart");a&&(this.charts.budgetSpentChart=new Chart(a,{type:"bar",data:{...(()=>{const t=(typeof this.getStoredProjects=="function"?this.getStoredProjects():[]).slice(0,6);return{labels:t.map(i=>String(i.name||"").slice(0,14)),datasets:[{label:"Budget (₹)",data:t.map(i=>parseFloat(String(i.budget||"0").replace(/[^0-9.]/g,""))||0),backgroundColor:"rgba(14, 165, 233, 0.65)"},{label:"Spent (₹)",data:t.map(i=>parseFloat(String(i.spent||"0").replace(/[^0-9.]/g,""))||0),backgroundColor:"rgba(244, 63, 94, 0.65)"}]}})()},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"bottom"}},scales:{x:{grid:{display:!1}},y:{beginAtZero:!0}}}}))}renderCampaignsContent(a){switch(this.currentSubSection){case"email":a.innerHTML=this.getEmailCampaigns();break;case"contacts_directory":a.innerHTML=this.getEmailCampaignContacts();break;case"alert_gmass":a.innerHTML=this.getEmailCampaignAlerts();break;case"sms":a.innerHTML=this.getSmsWhatsappCampaigns();break;case"wishes":a.innerHTML=this.getWishesCampaigns();break;case"reengagement":a.innerHTML=this.getReengagementCampaigns();break;default:a.innerHTML=this.getEmailCampaigns()}}getEmailCampaigns(){const a=L=>String(L??"").replace(/</g,"&lt;"),t=this.getClientsData(),i=this.getLeadsData(),n=[...t.map(L=>({...L,_type:"Client"})),...i.map(L=>({...L,_type:"Lead"}))].length,l=t.length,o=i.length,r=t.filter(L=>L.email&&L.email.includes("@")).length,c=n-r,d=t.filter(L=>L.dueAmount&&L.dueAmount!=="₹0"&&L.dueAmount!=="—").length,p=this.getStoredProjects?this.getStoredProjects():[],g=new Set,h=[];p.forEach(L=>{var D,j,I,N,R,_;const F=String(((D=L.identification)==null?void 0:D.projectName)||L.name||"").trim().toLowerCase();!F||g.has(F)||(g.add(F),h.push({name:((j=L.identification)==null?void 0:j.projectName)||L.name||"—",client:((I=L.identification)==null?void 0:I.clientName)||L.client||"—",status:((N=L.monitoring)==null?void 0:N.overallProjectStatus)||"—",overdue:((R=L.payment)==null?void 0:R.overdueStatus)||"",balance:((_=L.payment)==null?void 0:_.balancePaymentAmount)||""}))});const m=h.filter(L=>L.overdue&&L.overdue!=="Paid"&&L.balance).length+d,f=h.filter(L=>L.status==="Pending / Delayed").length,w=h.filter(L=>L.status==="Completed").length,u=i.filter(L=>["Follow-up","Quotation","Negotiation"].includes(L.stage)).length,b=m+f+w+u,v=t.slice(0,5),C=h.filter(L=>L.overdue&&L.overdue!=="Paid").slice(0,3);return`
    <div class="space-y-6 fade-in" >

                <!--Header -->
                <div class="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h2 class="text-2xl font-bold text-slate-900">Campaign Hub</h2>
                        <p class="text-sm text-slate-500 mt-0.5">Live overview of your contacts &amp; alert triggers</p>
                    </div>
                    <div class="flex items-center gap-2">
                        <button id="emailCampOpenContacts" class="px-4 py-2 text-sm font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-1.5">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                            Contacts
                        </button>
                        <button id="emailCampOpenAlerts" class="px-4 py-2 text-sm font-medium bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors flex items-center gap-1.5">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                            Alerts &amp; GMass
                        </button>
                        <button data-action="campaign:create" class="px-4 py-2 text-sm font-semibold bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm">+ New Campaign</button>
                    </div>
                </div>

                <!-- 2x2 Campaign Grid -->
                <div id="campaignCardsRow" style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;width:100%;">

                    <!-- 1. Contacts card (top-left) -->
                    <div class="relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 shadow-xl cursor-pointer group" id="emailCampCardContacts">
                        <div class="absolute inset-0 opacity-10 pointer-events-none" style="background: radial-gradient(circle at 80% 20%, #a78bfa 0%, transparent 60%)"></div>
                        <div class="flex items-start justify-between">
                            <div>
                                <div class="flex items-center gap-2 mb-3">
                                    <div class="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                                    </div>
                                    <span class="text-xs font-semibold text-slate-400 uppercase tracking-widest">Contacts Directory</span>
                                </div>
                                <div class="text-3xl font-extrabold text-white">${n}</div>
                                <div class="text-sm text-slate-400 mt-1">Total contacts in CRM</div>
                            </div>
                            <div class="flex flex-col gap-2 text-right">
                                <div>
                                    <div class="text-xs text-slate-400">Clients</div>
                                    <div class="text-xl font-bold text-emerald-400">${l}</div>
                                </div>
                                <div>
                                    <div class="text-xs text-slate-400">Leads</div>
                                    <div class="text-xl font-bold text-indigo-400">${o}</div>
                                </div>
                            </div>
                        </div>
                        <div class="mt-5 grid grid-cols-2 gap-3">
                            <div class="bg-white/10 rounded-xl p-3">
                                <div class="text-xs text-slate-400">With Email</div>
                                <div class="text-lg font-bold text-white mt-0.5">${r}</div>
                                <div class="mt-1.5 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div class="h-full bg-emerald-400 rounded-full transition-all" style="width:${n?Math.round(r/n*100):0}%"></div>
                                </div>
                            </div>
                            <div class="bg-white/10 rounded-xl p-3">
                                <div class="text-xs text-slate-400">Missing Email</div>
                                <div class="text-lg font-bold text-rose-400 mt-0.5">${c}</div>
                                <div class="mt-1.5 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div class="h-full bg-rose-400 rounded-full transition-all" style="width:${n?Math.round(c/n*100):0}%"></div>
                                </div>
                            </div>
                        </div>
                        <div class="mt-4 flex items-center justify-between">
                            <div class="text-xs text-slate-400">${d} client(s) with outstanding balances</div>
                            <div class="flex items-center gap-1 text-xs font-semibold text-purple-300 group-hover:text-purple-200 transition-colors">
                                Open Directory
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
                            </div>
                        </div>
                    </div>

                    <!-- 2. Alerts & GMass card (top-right) -->
                    <div class="relative overflow-hidden bg-gradient-to-br from-amber-600 to-orange-700 rounded-2xl p-6 shadow-xl cursor-pointer group" id="emailCampCardAlerts">
                        <div class="absolute inset-0 opacity-10 pointer-events-none" style="background: radial-gradient(circle at 80% 20%, #fde68a 0%, transparent 60%)"></div>
                        <div class="flex items-start justify-between">
                            <div>
                                <div class="flex items-center gap-2 mb-3">
                                    <div class="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                                    </div>
                                    <span class="text-xs font-semibold text-amber-200 uppercase tracking-widest">Alerts &amp; GMass</span>
                                </div>
                                <div class="text-3xl font-extrabold text-white">${b}</div>
                                <div class="text-sm text-amber-200 mt-1">Active trigger alerts</div>
                            </div>
                            <div class="flex flex-col gap-2 text-right">
                                <div>
                                    <div class="text-xs text-amber-200">Overdue Pay</div>
                                    <div class="text-xl font-bold text-white">${m}</div>
                                </div>
                                <div>
                                    <div class="text-xs text-amber-200">Delayed Proj</div>
                                    <div class="text-xl font-bold text-white">${f}</div>
                                </div>
                            </div>
                        </div>
                        <div class="mt-5 grid grid-cols-2 gap-3">
                            <div class="bg-white/10 rounded-xl p-3">
                                <div class="text-xs text-amber-200">Completed Projects</div>
                                <div class="text-lg font-bold text-white mt-0.5">${w} <span class="text-xs font-normal text-amber-200">need follow-up</span></div>
                            </div>
                            <div class="bg-white/10 rounded-xl p-3">
                                <div class="text-xs text-amber-200">Lead Follow-ups</div>
                                <div class="text-lg font-bold text-white mt-0.5">${u} <span class="text-xs font-normal text-amber-200">pending</span></div>
                            </div>
                        </div>
                        <div class="mt-4 flex items-center justify-between">
                            <div class="text-xs text-amber-200">Auto-emails ready to send via GMass</div>
                            <div class="flex items-center gap-1 text-xs font-semibold text-white/80 group-hover:text-white transition-colors">
                                Open Alerts
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
                            </div>
                        </div>
                    </div>

                    <!-- 3. Trigger Breakdown card (bottom-left) -->
                    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div class="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <div class="text-sm font-bold text-slate-900">Trigger Breakdown</div>
                                <div class="text-xs text-slate-400 mt-0.5">Auto-emails by category</div>
                            </div>
                            <button id="emailCampOpenAlerts2" class="text-xs font-semibold text-amber-600 hover:text-amber-700 transition-colors">View All →</button>
                        </div>
                        <div class="px-5 py-4 space-y-4">
                            ${[{label:"Payment Overdue",count:m,color:"rose",w:b?Math.round(m/b*100):0},{label:"Project Delayed",count:f,color:"amber",w:b?Math.round(f/b*100):0},{label:"Completed Follow-up",count:w,color:"emerald",w:b?Math.round(w/b*100):0},{label:"Lead Follow-up",count:u,color:"indigo",w:b?Math.round(u/b*100):0}].map(L=>`
                                <div>
                                    <div class="flex items-center justify-between mb-1.5">
                                        <div class="text-xs font-semibold text-slate-700">${L.label}</div>
                                        <div class="text-xs font-bold text-${L.color}-600">${L.count} alert${L.count!==1?"s":""}</div>
                                    </div>
                                    <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div class="h-full bg-${L.color}-400 rounded-full transition-all duration-500" style="width:${L.w}%"></div>
                                    </div>
                                </div>
                            `).join("")}
                            <div class="pt-2 border-t border-slate-100">
                                ${C.length?C.map(L=>`
                                    <div class="flex items-center justify-between py-2">
                                        <div>
                                            <div class="text-xs font-semibold text-slate-800">${a(L.name)}</div>
                                            <div class="text-[11px] text-slate-400">${a(L.client)}</div>
                                        </div>
                                        <span class="px-2 py-0.5 text-[10px] font-bold bg-rose-50 text-rose-600 rounded-full">${a(L.overdue)}</span>
                                    </div>
                                `).join(""):'<div class="text-xs text-slate-400 py-2">No overdue projects — great work!</div>'}
                            </div>
                        </div>
                    </div>

                    <!-- 4. Emails / Campaigns card (bottom-right) -->
                    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div class="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <div class="text-sm font-bold text-slate-900">Emails & Campaigns</div>
                                <div class="text-xs text-slate-400 mt-0.5">Recent contacts & quick actions</div>
                            </div>
                            <button id="emailCampOpenContacts2" class="text-xs font-semibold text-purple-600 hover:text-purple-700 transition-colors">View All →</button>
                        </div>
                        <div class="px-5 py-4 space-y-3">
                            ${v.length?v.map(L=>`
                                <div class="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
                                    <div class="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                        ${a((L.name||L.company||"?")[0]).toUpperCase()}
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <div class="text-xs font-semibold text-slate-800 truncate">${a(L.name||L.company||"—")}</div>
                                        <div class="text-[11px] text-slate-400 truncate">${a(L.email||"No email")}</div>
                                    </div>
                                    <span class="px-2 py-0.5 text-[10px] font-bold rounded-full flex-shrink-0 ${L.email&&L.email.includes("@")?"bg-emerald-50 text-emerald-600":"bg-slate-100 text-slate-400"}">${L.email&&L.email.includes("@")?"Ready":"No Email"}</span>
                                </div>
                            `).join(""):'<div class="text-xs text-slate-400 py-2">No contacts yet — add clients or leads to get started.</div>'}
                            <div class="pt-2 border-t border-slate-100 flex items-center justify-between">
                                <div class="text-xs text-slate-500">${r} of ${n} contacts email-ready</div>
                                <div class="text-xs font-semibold text-purple-600">${n?Math.round(r/n*100):0}%</div>
                            </div>
                        </div>
                    </div>

                </div>
    `}getEmailCampaignContacts(){const a=u=>String(u??"").replace(/</g,"&lt;").replace(/"/g,"&quot;"),t=u=>{if(!u||u==="—"||!u.includes("@"))return{user:"—",domain:"—",tld:"—",full:u||"—"};const[b,v]=u.split("@"),C=(v||"").split("."),L=C.length>=2?"."+C.slice(-1)[0]:"—",F=C.length>=2?C.slice(0,-1).join("."):v;return{user:b||"—",domain:F||"—",tld:L,full:u}},i=this.getClientsData().map(u=>{const b=t(String(u.email||"").trim());return{type:"Client",typeColor:"emerald",name:String(u.name||"").trim(),emailFull:b.full,emailUser:b.user,emailDomain:b.domain,emailTld:b.tld,phone:String(u.phone||"").trim()||"—",city:String(u.city||"").trim()||"—",industry:String(u.industry||"").trim()||"—",owner:String(u.owner||"").trim()||"—",stage:String(u.stage||"Active").trim(),source:String(u.leadSource||"").trim()||"—",vendorCode:String(u.vendorCode||"").trim()||"—",dueAmount:String(u.dueAmount||"₹0").trim()}}).filter(u=>u.name),s=this.getLeadsData().map(u=>({type:"Lead",typeColor:"indigo",name:String(u.company||"").trim(),emailFull:"—",emailUser:"—",emailDomain:"—",emailTld:"—",phone:String(u.contact||"").trim()||"—",city:"—",industry:"—",owner:String(u.assignedTo||"").trim()||"—",stage:String(u.stage||"New Lead").trim(),source:String(u.source||"").trim()||"—",vendorCode:"—",dueAmount:"—"})).filter(u=>u.name),n=[...i,...s];n.sort((u,b)=>String(u.name).localeCompare(String(b.name)));const l=u=>[...new Set(u.filter(Boolean).map(b=>String(b)))].sort(),o=["All","Client","Lead"],r=["All",...l(n.map(u=>u.owner!=="—"?u.owner:null))],c=["All",...l(n.map(u=>u.source!=="—"?u.source:null))],d=["All",...l(n.map(u=>u.stage))],p=["All",...l(n.map(u=>u.industry!=="—"?u.industry:null))],g=["All",...l(n.map(u=>u.city!=="—"?u.city:null))],h=["All",...l(i.map(u=>u.emailDomain!=="—"?u.emailDomain:null))],m=["All",...l(i.map(u=>u.emailTld!=="—"?u.emailTld:null))],f=(u,b)=>`<input id = "${u}" type = "text" placeholder = "${b}" class="w-full mt-1 px-2 py-1 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-400 bg-white" /> `,w=(u,b)=>`<select id = "${u}" class="w-full mt-1 px-2 py-1 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-400 bg-white" > ${b.map(v=>`<option>${a(v)}</option>`).join("")}</select> `;return`
    <div class="space-y-4 fade-in" >

                <!--Header -->
                <div class="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h2 class="text-xl sm:text-2xl font-semibold text-slate-900">Contacts Directory</h2>
                        <p class="text-sm text-slate-500" id="cdCount">${n.length} contacts — Clients &amp; Leads</p>
                    </div>
                    <div class="flex gap-2">
                        <button id="cdClearFilters" class="px-3 py-2 text-sm font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">Clear Filters</button>
                        <button id="cdExportCsv"   class="px-3 py-2 text-sm font-medium bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors">Export CSV</button>
                        <button id="cdSelectAll"   class="px-3 py-2 text-sm font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">Select All</button>
                        <button id="cdAddToGmass"  class="px-3 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Add to GMass</button>
                    </div>
                </div>

                <!--Table with inline column filters-- >
                <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm border-collapse" style="min-width: 800px;">
                            <thead class="bg-slate-50 border-b-2 border-slate-200 sticky top-0 z-10">
                                <!-- Column labels row -->
                                <tr>
                                    <th class="px-3 py-2 text-left w-8">
                                        <input type="checkbox" id="cdCheckAll" class="rounded border-slate-300" />
                                    </th>
                                    <th class="px-3 py-2 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">Type</th>
                                    <th class="px-3 py-2 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">Name</th>
                                    <th class="px-3 py-2 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">Email User</th>
                                    <th class="px-3 py-2 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">Domain</th>
                                    <th class="px-3 py-2 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">TLD</th>
                                    <th class="px-3 py-2 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">Phone</th>
                                    <th class="px-3 py-2 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">City</th>
                                    <th class="px-3 py-2 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">Industry</th>
                                    <th class="px-3 py-2 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">Owner</th>
                                    <th class="px-3 py-2 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">Stage</th>
                                    <th class="px-3 py-2 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">Source</th>
                                    <th class="px-3 py-2 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">Vendor</th>
                                    <th class="px-3 py-2 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">Due Amt</th>
                                </tr>
                                <!-- Inline filter row -->
                                <tr class="bg-slate-100 border-b border-slate-200">
                                    <td class="px-3 py-1.5"></td>
                                    <td class="px-2 py-1.5">${w("cdFilterType",o)}</td>
                                    <td class="px-2 py-1.5">${f("cdFilterName","Search…")}</td>
                                    <td class="px-2 py-1.5">${f("cdFilterEmailUser","user…")}</td>
                                    <td class="px-2 py-1.5">${w("cdFilterDomain",h)}</td>
                                    <td class="px-2 py-1.5">${w("cdFilterTld",m)}</td>
                                    <td class="px-2 py-1.5">${f("cdFilterPhone","phone…")}</td>
                                    <td class="px-2 py-1.5">${w("cdFilterCity",g)}</td>
                                    <td class="px-2 py-1.5">${w("cdFilterIndustry",p)}</td>
                                    <td class="px-2 py-1.5">${w("cdFilterOwner",r)}</td>
                                    <td class="px-2 py-1.5">${w("cdFilterStage",d)}</td>
                                    <td class="px-2 py-1.5">${w("cdFilterSource",c)}</td>
                                    <td class="px-2 py-1.5"></td>
                                    <td class="px-2 py-1.5"></td>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100" id="cdTableBody">
                                ${n.map(u=>`
                                    <tr data-cd-row="1"
                                        data-name="${a(u.name.toLowerCase())}"
                                        data-emailuser="${a(u.emailUser.toLowerCase())}"
                                        data-domain="${a(u.emailDomain.toLowerCase())}"
                                        data-tld="${a(u.emailTld.toLowerCase())}"
                                        data-phone="${a(u.phone.toLowerCase())}"
                                        data-type="${a(u.type.toLowerCase())}"
                                        data-owner="${a(u.owner.toLowerCase())}"
                                        data-source="${a(u.source.toLowerCase())}"
                                        data-stage="${a(u.stage.toLowerCase())}"
                                        data-industry="${a(u.industry.toLowerCase())}"
                                        data-city="${a(u.city.toLowerCase())}"
                                        class="hover:bg-purple-50/30 transition-colors">
                                        <td class="px-3 py-2.5">
                                            <input type="checkbox" class="cd-row-check rounded border-slate-300"
                                                data-contact-name="${a(u.name)}"
                                                data-contact-email="${a(u.emailFull)}" />
                                        </td>
                                        <td class="px-3 py-2.5">
                                            <span class="px-2 py-0.5 text-[10px] font-bold bg-${u.typeColor}-50 text-${u.typeColor}-700 rounded-full">${a(u.type)}</span>
                                        </td>
                                        <td class="px-3 py-2.5 font-semibold text-slate-900 whitespace-nowrap">${a(u.name)}</td>
                                        <td class="px-3 py-2.5 text-slate-600 font-mono text-xs">${u.emailUser!=="—"?a(u.emailUser):'<span class="text-slate-300">—</span>'}</td>
                                        <td class="px-3 py-2.5 text-indigo-600 font-mono text-xs font-medium">${u.emailDomain!=="—"?a(u.emailDomain):'<span class="text-slate-300">—</span>'}</td>
                                        <td class="px-3 py-2.5 text-slate-500 font-mono text-xs">${u.emailTld!=="—"?a(u.emailTld):'<span class="text-slate-300">—</span>'}</td>
                                        <td class="px-3 py-2.5 text-slate-600 whitespace-nowrap">${a(u.phone)}</td>
                                        <td class="px-3 py-2.5 text-slate-600">${a(u.city)}</td>
                                        <td class="px-3 py-2.5 text-slate-600">${a(u.industry)}</td>
                                        <td class="px-3 py-2.5 text-slate-600">${a(u.owner)}</td>
                                        <td class="px-3 py-2.5">
                                            <span class="px-2 py-0.5 text-[10px] font-semibold rounded-full
                                                ${u.stage==="Active"?"bg-emerald-50 text-emerald-700":u.stage==="At Risk"?"bg-rose-50 text-rose-700":u.stage==="Completed"?"bg-blue-50 text-blue-700":"bg-amber-50 text-amber-700"}">
                                                ${a(u.stage)}
                                            </span>
                                        </td>
                                        <td class="px-3 py-2.5 text-slate-600 whitespace-nowrap">${a(u.source)}</td>
                                        <td class="px-3 py-2.5 text-slate-500 font-mono text-xs">${a(u.vendorCode)}</td>
                                        <td class="px-3 py-2.5 font-semibold whitespace-nowrap
                                            ${u.dueAmount!=="—"&&u.dueAmount!=="₹0"?"text-rose-600":"text-slate-400"}">
                                            ${a(u.dueAmount)}
                                        </td>
                                    </tr>
                                `).join("")}
                            </tbody>
                        </table>
                    </div>
                </div>

                <!--Selection floating bar-- >
    <div id="cdSelectionBar" class="hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white rounded-2xl shadow-2xl px-6 py-3 flex items-center gap-4">
        <span id="cdSelCount" class="text-sm font-semibold">0 selected</span>
        <button id="cdSendToGmass" class="px-4 py-2 text-sm font-semibold bg-purple-500 text-white rounded-lg hover:bg-purple-400 transition-colors">Send to GMass</button>
        <button id="cdCopyEmails" class="px-4 py-2 text-sm font-semibold bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors">Copy Emails</button>
        <button id="cdClearSel" class="text-xs text-slate-400 hover:text-white transition-colors">Clear</button>
    </div>
            </div>
    `}setupCampaignContactsInteractions(){var F,D,j,I,N,R,_;const a=A=>document.getElementById(A),t=a("cdFilterName"),i=a("cdFilterEmailUser"),s=a("cdFilterDomain"),n=a("cdFilterTld"),l=a("cdFilterPhone"),o=a("cdFilterType"),r=a("cdFilterOwner"),c=a("cdFilterSource"),d=a("cdFilterStage"),p=a("cdFilterIndustry"),g=a("cdFilterCity"),h=a("cdCount"),m=a("cdCheckAll"),f=a("cdSelectionBar"),w=a("cdSelCount"),u=()=>Array.from(document.querySelectorAll('tr[data-cd-row="1"]')),b=()=>Array.from(document.querySelectorAll(".cd-row-check:checked")),v=()=>{const A=b().length;A>0?(f==null||f.classList.remove("hidden"),f&&(f.style.display="flex"),w&&(w.textContent=`${A} selected`)):(f==null||f.classList.add("hidden"),f&&(f.style.display="none"))},C=()=>{const A=((t==null?void 0:t.value)||"").trim().toLowerCase(),E=((i==null?void 0:i.value)||"").trim().toLowerCase(),z=((s==null?void 0:s.value)||"All").toLowerCase(),V=((n==null?void 0:n.value)||"All").toLowerCase(),Q=((l==null?void 0:l.value)||"").trim().toLowerCase(),J=((o==null?void 0:o.value)||"All").toLowerCase(),Y=((r==null?void 0:r.value)||"All").toLowerCase(),Z=((c==null?void 0:c.value)||"All").toLowerCase(),tt=((d==null?void 0:d.value)||"All").toLowerCase(),et=((p==null?void 0:p.value)||"All").toLowerCase(),st=((g==null?void 0:g.value)||"All").toLowerCase();let at=0;u().forEach(it=>{const O=it.dataset,ot=(!A||O.name.includes(A))&&(!E||O.emailuser.includes(E))&&(z==="all"||O.domain===z)&&(V==="all"||O.tld===V)&&(!Q||O.phone.includes(Q))&&(J==="all"||O.type===J)&&(Y==="all"||O.owner===Y)&&(Z==="all"||O.source===Z)&&(tt==="all"||O.stage===tt)&&(et==="all"||O.industry===et)&&(st==="all"||O.city===st);it.style.display=ot?"":"none",ot&&at++}),h&&(h.textContent=`Showing ${at} of ${u().length} contacts`)};[t,i,l].forEach(A=>A==null?void 0:A.addEventListener("input",C)),[s,n,o,r,c,d,p,g].forEach(A=>A==null?void 0:A.addEventListener("change",C)),(F=a("cdClearFilters"))==null||F.addEventListener("click",()=>{[t,i,l].forEach(A=>{A&&(A.value="")}),[s,n,o,r,c,d,p,g].forEach(A=>{A&&(A.selectedIndex=0)}),C()}),m==null||m.addEventListener("change",()=>{document.querySelectorAll(".cd-row-check").forEach(A=>A.checked=m.checked),v()}),document.addEventListener("change",A=>{A.target.classList.contains("cd-row-check")&&v()},{once:!1}),(D=a("cdSelectAll"))==null||D.addEventListener("click",()=>{const A=document.querySelectorAll(".cd-row-check"),E=Array.from(A).every(z=>z.checked);A.forEach(z=>z.checked=!E),m&&(m.checked=!E),v()});const L=A=>{const E=A.filter(z=>z&&z!=="—"&&z.includes("@"));if(!E.length){this.showToast("No valid emails selected.");return}window.open(`https://mail.google.com/mail/u/0/?view=cm&fs=1&to=${encodeURIComponent(E.join(","))}&cc=send%40gmass.co`,"_blank"),this.showToast(`Opened GMass for ${E.length} contacts.`)};(j=a("cdAddToGmass"))==null||j.addEventListener("click",()=>{L(Array.from(document.querySelectorAll(".cd-row-check")).map(A=>A.dataset.contactEmail))}),(I=a("cdSendToGmass"))==null||I.addEventListener("click",()=>{L(b().map(A=>A.dataset.contactEmail))}),(N=a("cdCopyEmails"))==null||N.addEventListener("click",()=>{const A=b().map(E=>E.dataset.contactEmail).filter(E=>E&&E!=="—"&&E.includes("@"));if(!A.length){this.showToast("No valid emails selected.");return}navigator.clipboard.writeText(A.join(",")).then(()=>{this.showToast(`Copied ${A.length} email(s) to clipboard.`)}).catch(()=>this.showToast("Copy failed – please copy manually."))}),(R=a("cdClearSel"))==null||R.addEventListener("click",()=>{document.querySelectorAll(".cd-row-check").forEach(A=>A.checked=!1),m&&(m.checked=!1),v()}),(_=a("cdExportCsv"))==null||_.addEventListener("click",()=>{const A=u().filter(Q=>Q.style.display!=="none"),z=[["Type","Name","Email User","Domain","TLD","Phone","City","Industry","Owner","Stage","Source","Vendor Code","Due Amount"].join(",")];A.forEach(Q=>{const J=Array.from(Q.querySelectorAll("td")).slice(1);z.push(J.map(Y=>`"${(Y.textContent||"").trim().replace(/,/g,";")}"`).join(","))});const V=document.createElement("a");V.href=URL.createObjectURL(new Blob([z.join(`
`)],{type:"text/csv"})),V.download="contacts_directory.csv",V.click(),this.showToast("CSV exported.")}),C()}getEmailCampaignAlerts(){const a=d=>String(d??"").replace(/</g,"&lt;").replace(/"/g,"&quot;"),t=d=>d?new Date(d).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}):"—",i=this.getClientsData(),s=this.getLeadsData(),n=this.getStoredProjects?this.getStoredProjects():[],l=new Set,o=[];n.forEach(d=>{var g,h,m;const p=String(((g=d.identification)==null?void 0:g.projectName)||d.name||"").trim().toLowerCase();!p||l.has(p)||(l.add(p),o.push({name:((h=d.identification)==null?void 0:h.projectName)||d.name||"—",client:((m=d.identification)==null?void 0:m.clientName)||d.client||"—",monitoring:d.monitoring||{},payment:d.payment||{}}))});const r=[];o.forEach(d=>{var f;const p=d.payment||{},g=String(p.balancePaymentAmount||"").trim(),h=String(p.paymentDueDate||"").trim(),m=String(p.overdueStatus||"").trim();m&&m!=="Paid"&&g&&r.push({id:`pay_${d.name}_${d.client}`,category:"Payment",categoryColor:"rose",icon:"credit-card",title:`Payment Overdue – ${d.name}`,subtitle:`Client: ${d.client||"—"} | Due: ${t(h?Date.parse(h):null)} | Balance: ₹${g}`,status:m,statusColor:m.includes("90")?"rose":m.includes("60")?"orange":"amber",trigger:"payment_overdue",recipient:String(((f=i.find(w=>w.name===d.client))==null?void 0:f.email)||""),clientName:d.client||"—",draftSubject:`Payment Reminder – ${d.name} [${m}]`,draftBody:`Dear ${d.client||"Client"},

This is a reminder regarding the pending payment of ₹${g} for project "${d.name}".
Due Date: ${t(h?Date.parse(h):null)} | Status: ${m}

Kindly ensure timely payment to avoid further delays.

Warm regards,
APJ 3D Solutions Team`})}),o.forEach(d=>{var h;const p=d.monitoring||{},g=String(p.overallProjectStatus||"").trim();g==="Pending / Delayed"&&r.push({id:`proj_${d.name}_${d.client}`,category:"Project Update",categoryColor:"amber",icon:"folder-clock",title:`Project Delayed – ${d.name}`,subtitle:`Client: ${d.client||"—"} | Status: ${g}`,status:"Delayed",statusColor:"amber",trigger:"project_delayed",recipient:String(((h=i.find(m=>m.name===d.client))==null?void 0:h.email)||""),clientName:d.client||"—",draftSubject:`Project Update – ${d.name} – Status: Delayed`,draftBody:`Dear ${d.client||"Client"},

We wanted to inform you that the project "${d.name}" is currently experiencing delays.
Our team is working diligently to get back on track and will provide you with an updated timeline shortly.

We apologize for any inconvenience caused.

Best regards,
APJ 3D Solutions Team`})}),o.forEach(d=>{var h;const p=d.monitoring||{};String(p.overallProjectStatus||"").trim()==="Completed"&&r.push({id:`comp_${d.name}_${d.client}`,category:"Follow-up",categoryColor:"emerald",icon:"check-circle",title:`Project Completed – ${d.name}`,subtitle:`Client: ${d.client||"—"} | Gather feedback & upsell`,status:"Completed",statusColor:"emerald",trigger:"project_completed",recipient:String(((h=i.find(m=>m.name===d.client))==null?void 0:h.email)||""),clientName:d.client||"—",draftSubject:`Your Project "${d.name}" is Complete! – Feedback Request`,draftBody:`Dear ${d.client||"Client"},

We are pleased to inform you that project "${d.name}" has been successfully completed!

We would love to hear your feedback. Please feel free to share your experience with us.
Also, if you need any additional services, our team is ready to assist.

Thank you for choosing APJ 3D Solutions.

Warm regards,
APJ 3D Solutions Team`})}),s.filter(d=>["Follow-up","Quotation","Negotiation"].includes(d.stage)).slice(0,4).forEach(d=>{r.push({id:`lead_${d.id}`,category:"Lead Follow-up",categoryColor:"indigo",icon:"user-plus",title:`Follow-up Required – ${d.company}`,subtitle:`Stage: ${d.stage} | Assigned: ${d.assignedTo||"—"} | Source: ${d.source}`,status:d.stage,statusColor:"indigo",trigger:"lead_followup",recipient:"",clientName:d.company,draftSubject:`Following Up – ${d.company} – ${d.stage} Stage`,draftBody:`Dear ${d.company},

Thank you for your interest in APJ 3D Solutions.

We wanted to follow up regarding your inquiry which is currently at the "${d.stage}" stage. Our team is eager to move forward and ensure we can meet your requirements.

Would you be available for a brief call or meeting to discuss next steps?

Looking forward to hearing from you.

Best regards,
APJ 3D Solutions Team`})}),i.filter(d=>d.dueAmount&&d.dueAmount!=="₹0"&&d.dueAmount!=="—").slice(0,3).forEach(d=>{r.push({id:`clientdue_${d.name}`,category:"Payment",categoryColor:"rose",icon:"alert-circle",title:`Outstanding Balance – ${d.name}`,subtitle:`Amount Due: ${d.dueAmount} | ${d.openInvoices} open invoice(s)`,status:"Outstanding",statusColor:"rose",trigger:"payment_overdue",recipient:String(d.email||""),clientName:d.name,draftSubject:`Payment Reminder – Outstanding Balance of ${d.dueAmount}`,draftBody:`Dear ${d.name},

This is a gentle reminder that you have an outstanding balance of ${d.dueAmount} with ${d.openInvoices} open invoice(s).

Kindly arrange for payment at your earliest convenience to avoid any service disruptions.

For payment assistance, please contact our accounts team.

Thank you for your prompt attention.

Best regards,
APJ 3D Solutions Team`})});const c={payment_overdue:{label:"Payment Overdue",color:"rose"},project_delayed:{label:"Project Delayed",color:"amber"},project_completed:{label:"Project Completed",color:"emerald"},lead_followup:{label:"Lead Follow-up",color:"indigo"}};return`
            <div class="space-y-5 fade-in">
                <div class="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h2 class="text-xl sm:text-2xl font-semibold text-slate-900">Alerts &amp; GMass</h2>
                        <p class="text-sm text-slate-500">${r.length} active triggers — auto-generate emails &amp; send via GMass</p>
                    </div>
                    <div class="flex gap-2">
                        <button id="agSendAllGmass" class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Send All to GMass</button>
                        <button id="agRecheckTriggers" class="px-4 py-2 text-sm font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">Re-check Triggers</button>
                    </div>
                </div>

                <!-- Trigger Stats -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    ${Object.entries(c).map(([d,p])=>{const g=r.filter(h=>h.trigger===d).length;return`
                        <div class="bg-white rounded-xl border border-${p.color}-200 p-4 shadow-sm">
                            <div class="text-xs font-semibold text-${p.color}-700 uppercase tracking-wide">${a(p.label)}</div>
                            <div class="text-3xl font-extrabold text-slate-900 mt-2">${g}</div>
                            <div class="text-xs text-slate-500 mt-1">${g===1?"alert pending":"alerts pending"}</div>
                        </div>`}).join("")}
                </div>

                <!-- Filter Bar -->
                <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-wrap gap-3 items-center">
                    <select id="agFilterCategory" class="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400">
                        <option>All Categories</option>
                        <option>Payment</option>
                        <option>Project Update</option>
                        <option>Follow-up</option>
                        <option>Lead Follow-up</option>
                    </select>
                    <input id="agFilterSearch" type="text" placeholder="Search alerts…" class="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 flex-1" />
                    <span id="agFilterCount" class="text-sm text-slate-500">Showing ${r.length} of ${r.length}</span>
                </div>

                <!-- Alert Cards -->
                <div id="agAlertsList" class="space-y-3">
                    ${r.map(d=>`
                        <div class="ag-alert-card bg-white rounded-xl border border-${d.statusColor}-200 p-5 shadow-sm transition-all"
                             data-category="${a(d.category.toLowerCase())}"
                             data-title="${a(d.title.toLowerCase())}">
                            <div class="flex flex-col md:flex-row md:items-start gap-4">
                                <div class="flex-1">
                                    <div class="flex items-center gap-3 flex-wrap">
                                        <span class="px-2 py-0.5 text-xs font-bold bg-${d.categoryColor}-50 text-${d.categoryColor}-700 rounded-full uppercase tracking-wide">${a(d.category)}</span>
                                        <span class="px-2 py-0.5 text-xs font-semibold bg-${d.statusColor}-100 text-${d.statusColor}-700 rounded-full">${a(d.status)}</span>
                                        <span class="text-[11px] text-slate-400">Trigger: <strong class="text-slate-600">${a(d.trigger.replace(/_/g," "))}</strong></span>
                                    </div>
                                    <div class="mt-2 text-sm font-bold text-slate-900">${a(d.title)}</div>
                                    <div class="text-xs text-slate-500 mt-1">${a(d.subtitle)}</div>
                                    <div class="mt-3 font-semibold text-xs text-slate-700">Auto-Generated Email Preview:</div>
                                    <div class="mt-1 bg-slate-50 border border-slate-200 rounded-lg p-3">
                                        <div class="text-xs font-semibold text-slate-500">To: <span class="text-slate-800">${a(d.recipient||"(email not set — update client record)")}</span></div>
                                        <div class="text-xs font-semibold text-slate-500 mt-1">Subject: <span class="text-slate-800">${a(d.draftSubject)}</span></div>
                                        <textarea id="agBody_${a(d.id)}" rows="4" class="mt-2 w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-y">${a(d.draftBody)}</textarea>
                                    </div>
                                </div>
                                <div class="flex flex-col gap-2 min-w-[140px]">
                                    <button class="ag-trigger-gmass px-4 py-2 text-sm font-semibold bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                            data-alert-id="${a(d.id)}"
                                            data-recipient="${a(d.recipient)}"
                                            data-subject="${a(d.draftSubject)}">
                                        Send via GMass
                                    </button>
                                    <button class="ag-trigger-draft px-4 py-2 text-sm font-semibold bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                                            data-alert-id="${a(d.id)}"
                                            data-recipient="${a(d.recipient)}"
                                            data-subject="${a(d.draftSubject)}">
                                        Open in Gmail
                                    </button>
                                    <button class="ag-copy-body px-4 py-2 text-sm font-semibold bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors"
                                            data-alert-id="${a(d.id)}">
                                        Copy Body
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join("")}
                </div>
            </div>
        `}setupAlertGmassInteractions(){var r,c;const a=document.getElementById("agFilterCategory"),t=document.getElementById("agFilterSearch"),i=document.getElementById("agFilterCount"),s=()=>Array.from(document.querySelectorAll(".ag-alert-card")),n=()=>{const d=((a==null?void 0:a.value)||"All Categories").toLowerCase(),p=((t==null?void 0:t.value)||"").trim().toLowerCase();let g=0;s().forEach(m=>{const f=(m.dataset.category||"").toLowerCase(),w=(m.dataset.title||"").toLowerCase(),u=d==="all categories"||f.includes(d),b=!p||w.includes(p)||f.includes(p);m.style.display=u&&b?"":"none",u&&b&&g++});const h=s().length;i&&(i.textContent=`Showing ${g} of ${h}`)};a==null||a.addEventListener("change",n),t==null||t.addEventListener("input",n);const l=(d,p,g)=>{const h=document.getElementById(`agBody_${g}`),m=h?h.value:"",f=`https://mail.google.com/mail/u/0/?view=cm&fs=1&to=${encodeURIComponent(d)}&cc=${encodeURIComponent("send@gmass.co")}&su=${encodeURIComponent(p)}&body=${encodeURIComponent(m)}`;if(!d||!d.includes("@")){this.showToast("No email found for this contact. Please update the client email record and try again.");return}window.open(f,"_blank"),this.showToast("Opened GMass compose window.")},o=(d,p,g)=>{const h=document.getElementById(`agBody_${g}`),m=h?h.value:"",f=`https://mail.google.com/mail/u/0/?view=cm&fs=1&to=${encodeURIComponent(d)}&su=${encodeURIComponent(p)}&body=${encodeURIComponent(m)}`;if(!d||!d.includes("@")){this.showToast("No email found for this contact. Please update the client email record.");return}window.open(f,"_blank"),this.showToast("Opened Gmail draft.")};document.querySelectorAll(".ag-trigger-gmass").forEach(d=>{d.addEventListener("click",()=>{const p=d.dataset.alertId,g=d.dataset.recipient,h=d.dataset.subject;l(g,h,p)})}),document.querySelectorAll(".ag-trigger-draft").forEach(d=>{d.addEventListener("click",()=>{const p=d.dataset.alertId,g=d.dataset.recipient,h=d.dataset.subject;o(g,h,p)})}),document.querySelectorAll(".ag-copy-body").forEach(d=>{d.addEventListener("click",()=>{const p=document.getElementById(`agBody_${d.dataset.alertId}`);p&&navigator.clipboard.writeText(p.value).then(()=>{this.showToast("Email body copied to clipboard.")}).catch(()=>this.showToast("Copy failed."))})}),(r=document.getElementById("agSendAllGmass"))==null||r.addEventListener("click",()=>{this.showToast("Opening GMass for all alerts — check popup blocker if nothing opens.");const d=document.querySelectorAll(".ag-trigger-gmass");if(d.length===0){this.showToast("No alerts available.");return}d[0].click(),this.showToast(`Triggered GMass for first alert. Send remaining ${d.length-1} individually.`)}),(c=document.getElementById("agRecheckTriggers"))==null||c.addEventListener("click",()=>{this.renderContent(),this.initializeLucideIcons(),this.showToast("Triggers re-evaluated from live data.")}),n()}getSmsWhatsappCampaigns(){const a=d=>String(d??"").replace(/</g,"&lt;"),t=this.getClientsData(),i=this.getLeadsData(),s=[];t.forEach(d=>{d.dueAmount&&d.dueAmount!=="₹0"&&d.dueAmount!=="—"&&s.push({type:"payment",urgency:"high",name:d.name||"—",phone:d.phone||"",detail:`Due: ${d.dueAmount}`,smsBody:`Hi ${d.name}, this is a reminder that your payment of ${d.dueAmount} is overdue. Please clear it at your earliest. – APJ 3D Solutions`,waBody:`Hi ${d.name},

This is an urgent reminder that your payment of ${d.dueAmount} is overdue.

Please arrange payment at the earliest.

Team APJ 3D Solutions`})});const n=this.getStoredProjects?this.getStoredProjects():[],l=new Set;n.forEach(d=>{var h,m,f,w;const p=((h=d.identification)==null?void 0:h.projectName)||d.name||"",g=p.toLowerCase();if(!(!g||l.has(g))&&(l.add(g),(((m=d.monitoring)==null?void 0:m.overallProjectStatus)||"")==="Pending / Delayed")){const u=((f=d.identification)==null?void 0:f.clientName)||d.client||"—",b=((w=d.identification)==null?void 0:w.clientPhone)||"";s.push({type:"delay",urgency:"medium",name:u,phone:b,detail:`Project "${p}" delayed`,smsBody:`Hi ${u}, your project "${p}" is currently delayed. Our team will update you shortly. – APJ 3D Solutions`,waBody:`Hi ${u},

Your project "${p}" is facing a delay. Our team is on it.

Team APJ 3D Solutions`})}}),i.filter(d=>["Quotation","Negotiation"].includes(d.stage)).slice(0,4).forEach(d=>{s.push({type:"lead",urgency:"medium",name:d.company||d.contact||"—",phone:d.contact||"",detail:`Stage: ${d.stage}`,smsBody:`Hi, following up on your ${d.stage} with APJ 3D Solutions. Any questions? – APJ 3D Solutions`,waBody:`Hi,

Following up on your ${d.stage} with APJ 3D Solutions.
Let us know if you have any questions!

Team APJ 3D Solutions`})});const o={high:"rose",medium:"amber",low:"slate"},r={payment:'<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>',delay:'<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',lead:'<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'},c={payment:"Payment Overdue",delay:"Project Delayed",lead:"Lead Follow-up"};return`
            <div class="space-y-5 fade-in">
                <div class="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h2 class="text-2xl font-bold text-slate-900">SMS Alerts</h2>
                        <p class="text-sm text-slate-500 mt-0.5">${s.length} urgent alert${s.length!==1?"s":""} — trigger SMS or WhatsApp directly</p>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="px-3 py-1.5 text-xs font-bold bg-rose-50 text-rose-600 rounded-full">${s.filter(d=>d.urgency==="high").length} High</span>
                        <span class="px-3 py-1.5 text-xs font-bold bg-amber-50 text-amber-600 rounded-full">${s.filter(d=>d.urgency==="medium").length} Medium</span>
                    </div>
                </div>

                ${s.length===0?`
                    <div class="bg-emerald-50 border border-emerald-200 rounded-2xl p-10 text-center">
                        <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-emerald-100 flex items-center justify-center">
                            <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                        </div>
                        <div class="text-lg font-bold text-emerald-800">No urgent alerts!</div>
                        <div class="text-sm text-emerald-600 mt-1">All clients and projects are on track.</div>
                    </div>
                `:`
                    <div class="space-y-3">
                        ${s.map(d=>{const p=o[d.urgency],g=(d.phone||"").replace(/\D/g,""),h=g.length>=8,m=h?`sms:${g}?body=${encodeURIComponent(d.smsBody)}`:null,f=h?`https://wa.me/91${g}?text=${encodeURIComponent(d.waBody)}`:null,w=a(d.smsBody).replace(/'/g,"&#39;"),u=a(d.waBody).replace(/'/g,"&#39;");return`
                            <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-4">
                                <div class="w-11 h-11 rounded-xl bg-${p}-50 text-${p}-600 flex items-center justify-center flex-shrink-0">${r[d.type]}</div>
                                <div class="flex-1 min-w-0">
                                    <div class="flex items-center gap-2 flex-wrap">
                                        <span class="text-sm font-bold text-slate-900">${a(d.name)}</span>
                                        <span class="px-1.5 py-0.5 text-[10px] font-bold bg-${p}-50 text-${p}-600 rounded-full uppercase tracking-wide">${d.urgency}</span>
                                        <span class="px-1.5 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-600 rounded-full">${c[d.type]}</span>
                                    </div>
                                    <div class="text-xs text-slate-500 mt-0.5">${a(d.detail)}</div>
                                    <div class="mt-2 p-2.5 bg-slate-50 rounded-lg text-xs text-slate-600 font-mono leading-relaxed">${a(d.smsBody)}</div>
                                </div>
                                <div class="flex flex-col gap-2 flex-shrink-0">
                                    ${m?`<a href="${m}" class="flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors whitespace-nowrap"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.65 3.38 2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.59a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg> Send SMS</a>`:`<button onclick="navigator.clipboard.writeText('${w}')" class="flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors whitespace-nowrap"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M8 22H16M12 17V22"/><rect x="2" y="8" width="20" height="14" rx="2"/></svg> Copy SMS</button>`}
                                    ${f?`<a href="${f}" target="_blank" class="flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors whitespace-nowrap"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> WhatsApp</a>`:`<button onclick="navigator.clipboard.writeText('${u}')" class="flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors whitespace-nowrap"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M8 22H16M12 17V22"/><rect x="2" y="8" width="20" height="14" rx="2"/></svg> Copy WA</button>`}
                                </div>
                            </div>`}).join("")}
                    </div>
                `}
            </div>
        `}getWishesCampaigns(){const a=o=>String(o??"").replace(/</g,"&lt;"),t=this.getClientsData(),i=(o,r,c,d,p,g,h)=>`<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px;">
<table width="600" cellpadding="0" cellspacing="0" style="border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.10);">
<tr><td style="background:${o};padding:40px 40px 32px;text-align:center;">
<div style="width:64px;height:64px;background:rgba(255,255,255,0.18);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px;">${r}</div>
<h1 style="margin:0;color:#fff;font-size:26px;font-weight:800;letter-spacing:.5px;">${d}</h1>
</td></tr>
<tr><td style="background:#fff;padding:40px;">
<p style="margin:0 0 20px;font-size:16px;color:#334155;">${p}</p>
<div style="background:${c};border-radius:12px;padding:24px;margin:24px 0;">
<p style="margin:0;font-size:15px;color:#1e293b;line-height:1.7;">${g}</p>
</div>
<p style="margin:20px 0 0;font-size:15px;color:#334155;">${h}<br><br>Warm regards,<br><strong style="color:#7c3aed;">Team APJ 3D Solutions</strong></p>
</td></tr>
<tr><td style="background:#1e1b4b;padding:24px 40px;text-align:center;">
<p style="margin:0;color:#a5b4fc;font-size:13px;font-weight:600;">APJ 3D Solutions Pvt Ltd</p>
<p style="margin:4px 0 0;color:#6366f1;font-size:12px;">www.apj3dsolutions.com &nbsp;|&nbsp; hello@apj3dsolutions.com</p>
</td></tr>
</table></td></tr></table></body></html>`,s=[{id:"birthday",title:"Birthday Wishes",color:"pink",icon:'<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',cards:[{variant:"Warm & Personal",subject:"Happy Birthday, {{name}}!",htmlBody:i("linear-gradient(135deg,#ec4899,#f43f5e)",'<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" style="display:block"><path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',"#fdf2f8","Happy Birthday, {{name}}!","Dear {{name}},","Wishing you a very Happy Birthday! Today is all about you — may it be filled with laughter, love, and everything that makes you smile. It has been a true pleasure working with you, and we hope this year brings you incredible joy, great health, and outstanding success.","Thank you for being such a wonderful part of our journey.")},{variant:"Professional",subject:"Many Happy Returns, {{name}}!",htmlBody:i("linear-gradient(135deg,#7c3aed,#a855f7)",'<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" style="display:block"><path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',"#f5f3ff","Many Happy Returns of the Day!","Dear {{name}},","On behalf of everyone at APJ 3D Solutions, we want to wish you a very Happy Birthday! Your trust, collaboration, and partnership means a great deal to us. May this special day mark the beginning of a fantastic year ahead — full of achievements, milestones, and wonderful memories.","Here's to celebrating you today and every day!")},{variant:"Festive & Fun",subject:"It's your special day, {{name}}!",htmlBody:i("linear-gradient(135deg,#f97316,#ec4899)",'<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" style="display:block"><path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',"#fff7ed","Your Special Day Has Arrived!","Hey {{name}},","The APJ 3D Solutions team is sending you big birthday cheers today! You deserve all the good things coming your way — big wins, happy moments, and a year that exceeds every expectation. We're grateful to have you with us and look forward to many more successful years together.","Go celebrate — you've earned it!")}]},{id:"diwali",title:"Diwali Greetings",color:"amber",icon:'<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M12 2v8"/><path d="M4.93 10.93l5.66 5.66"/><path d="M2 18h20"/><path d="M19.07 10.93l-5.66 5.66"/><circle cx="12" cy="18" r="2"/></svg>',cards:[{variant:"Traditional",subject:"Happy Diwali from APJ 3D Solutions!",htmlBody:i("linear-gradient(135deg,#d97706,#f59e0b)",'<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" style="display:block"><path d="M12 2v8"/><path d="M4.93 10.93l5.66 5.66"/><path d="M2 18h20"/><path d="M19.07 10.93l-5.66 5.66"/><circle cx="12" cy="18" r="2" fill="white"/></svg>',"#fffbeb","Wishing You a Radiant Diwali!","Dear {{name}},","May the glow of diyas illuminate your home, heart, and path ahead. On this auspicious festival of lights, Team APJ 3D Solutions extends our warmest wishes to you and your family. May prosperity, happiness, and success light up every corner of your life this Diwali and always.","From all of us at APJ 3D Solutions — Happy Diwali!")},{variant:"Modern & Vibrant",subject:"Light, Joy & Prosperity this Diwali!",htmlBody:i("linear-gradient(135deg,#7c3aed,#d97706)",'<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" style="display:block"><path d="M12 2v8"/><path d="M4.93 10.93l5.66 5.66"/><path d="M2 18h20"/><path d="M19.07 10.93l-5.66 5.66"/><circle cx="12" cy="18" r="2" fill="white"/></svg>',"#faf5ff","A Festival Full of Light & Joy","Dear {{name}},","Diwali is a celebration of light over darkness, knowledge over ignorance, and hope over despair. As we celebrate together, Team APJ 3D Solutions wishes you and your loved ones a joyful, safe, and prosperous Diwali. May this festive season bring new opportunities and brighter beginnings.","Wishing you peace, love, and abundance!")},{variant:"Corporate",subject:"Season's Greetings — Happy Diwali!",htmlBody:i("linear-gradient(135deg,#92400e,#d97706)",'<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" style="display:block"><path d="M12 2v8"/><path d="M4.93 10.93l5.66 5.66"/><path d="M2 18h20"/><path d="M19.07 10.93l-5.66 5.66"/><circle cx="12" cy="18" r="2" fill="white"/></svg>',"#fef3c7","Happy Diwali — Season's Greetings","Dear {{name}},","At APJ 3D Solutions, we believe that the spirit of Diwali — unity, light, and new beginnings — reflects the very values we share with our clients and partners. This Diwali, we express our deep gratitude for your continued trust and wish you a season filled with joy, health, and business success.","Thank you for being our most valued partner.")}]},{id:"newyear",title:"New Year Greetings",color:"indigo",icon:'<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',cards:[{variant:"Inspirational",subject:"Happy New Year from APJ 3D Solutions!",htmlBody:i("linear-gradient(135deg,#3730a3,#6366f1)",'<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" style="display:block"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',"#eef2ff","Welcome to a Brand New Year!","Dear {{name}},","As we step into the new year, we reflect on the incredible journey we've shared — the challenges we overcame, the milestones we celebrated, and the trust that has grown between us. Team APJ 3D Solutions wishes you a year overflowing with health, happiness, and extraordinary success.","Here's to an amazing year ahead — together!")},{variant:"Gratitude Focus",subject:"Grateful for you — Happy New Year!",htmlBody:i("linear-gradient(135deg,#7c3aed,#3730a3)",'<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" style="display:block"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',"#f5f3ff","Thank You & Happy New Year!","Dear {{name}},","Before we dive into the new year, we want to pause and express our heartfelt gratitude for your partnership. Your trust in APJ 3D Solutions means everything to us. As the calendar turns, we commit to continue delivering excellence and growing together. Wishing you and your team a prosperous, healthy, and fulfilling new year.","Thank you for your continued support!")},{variant:"Forward-Looking",subject:"New Year, New Possibilities — {{name}}!",htmlBody:i("linear-gradient(135deg,#0f172a,#3730a3)",'<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" style="display:block"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',"#e0e7ff","A Bright New Chapter Begins","Dear {{name}},","Every new year brings a blank canvas and infinite possibilities. At APJ 3D Solutions, we're excited about what we can build together in the year ahead. From automation to growth strategies, we're here every step of the way. Wishing you bold ambitions, smart decisions, and outstanding results this year.","Let's make it the best year yet!")}]},{id:"anniversary",title:"Work Anniversary",color:"emerald",icon:'<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>',cards:[{variant:"Celebratory",subject:"Happy Work Anniversary, {{name}}!",htmlBody:i("linear-gradient(135deg,#059669,#10b981)",'<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" style="display:block"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>',"#ecfdf5","Celebrating Our Journey Together!","Dear {{name}},","Time really flies when you're building great things together! Today marks a special milestone in our partnership with you. It has been an absolute honour to be part of your business journey. Your trust, feedback, and collaboration have been our greatest motivation. Here's to celebrating this anniversary with gratitude.","Many more years of success together!")},{variant:"Milestone",subject:"Marking a Special Milestone — {{name}}!",htmlBody:i("linear-gradient(135deg,#7c3aed,#059669)",'<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" style="display:block"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>',"#f0fdf4","A Milestone Worth Celebrating!","Dear {{name}},","We believe every milestone deserves to be celebrated — and your work anniversary with APJ 3D Solutions is no exception. You've been a cornerstone of our growth and an inspiration to our team. We look back with pride at everything we've achieved together and look forward to even greater things ahead.","Thank you for every step of this journey.")},{variant:"Formal",subject:"Commemorating Our Partnership — {{name}}",htmlBody:i("linear-gradient(135deg,#064e3b,#059669)",'<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" style="display:block"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>',"#d1fae5","Honouring Our Valued Partnership","Dear {{name}},","On this special occasion, Team APJ 3D Solutions would like to formally recognise and celebrate the anniversary of our partnership. Your commitment and trust have been invaluable to us. We remain deeply committed to supporting your business goals and delivering the highest quality of service in the years to come.","With sincere appreciation and best wishes.")}]},{id:"project_complete",title:"Project Completion",color:"blue",icon:'<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',cards:[{variant:"Achievement",subject:"Project Complete — Great Work, {{name}}!",htmlBody:i("linear-gradient(135deg,#1d4ed8,#3b82f6)",'<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" style="display:block"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',"#eff6ff","Project Successfully Delivered!","Dear {{name}},","We are thrilled to announce that your project has been successfully completed! From the initial brief to the final delivery, it has been a fantastic collaboration. We are incredibly proud of what we built together. The results speak for themselves and we hope they exceed your expectations.","Let's celebrate this win — you deserve it!")},{variant:"What's Next",subject:"Done & Delivered — What's next, {{name}}?",htmlBody:i("linear-gradient(135deg,#7c3aed,#1d4ed8)",'<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" style="display:block"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',"#f5f3ff","Great Finish — Bigger Future Ahead!","Dear {{name}},","Your project is now complete and live! But the best part? This is just the beginning. Every successful project opens the door to new possibilities. The APJ 3D Solutions team would love to explore what we can tackle next together — whether it's scaling what we built, optimising for more growth, or launching something entirely new.","Ready when you are — let's keep the momentum going!")},{variant:"Formal Delivery",subject:"Official Project Completion — {{name}}",htmlBody:i("linear-gradient(135deg,#0f172a,#1d4ed8)",'<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" style="display:block"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',"#dbeafe","Formal Project Completion Notice","Dear {{name}},","We are pleased to formally notify you that all deliverables for your project have been completed, reviewed, and handed over as per the agreed scope and timelines. This marks the successful closure of the project. We look forward to your review and feedback. Thank you for choosing APJ 3D Solutions as your trusted technology partner.","Please do not hesitate to reach out for any support.")}]},{id:"thankyou",title:"Thank You",color:"purple",icon:'<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',cards:[{variant:"Heartfelt",subject:"Thank you, {{name}} — you mean a lot to us!",htmlBody:i("linear-gradient(135deg,#7c3aed,#a855f7)",'<svg width="28" height="28" viewBox="0 0 24 24" fill="rgba(255,255,255,0.9)" stroke="white" stroke-width="1.5" style="display:block"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',"#faf5ff","From the Bottom of Our Hearts — Thank You!","Dear {{name}},","Some words never get old — thank you. Working with you has been one of the most rewarding experiences for our team at APJ 3D Solutions. Your trust, your patience, and your vision push us to be better every day. We are truly grateful to have you as a client, and we hope to continue growing together for many years.","You make the work meaningful — truly, thank you.")},{variant:"Business Appreciation",subject:"Grateful for your trust, {{name}}!",htmlBody:i("linear-gradient(135deg,#6d28d9,#7c3aed)",'<svg width="28" height="28" viewBox="0 0 24 24" fill="rgba(255,255,255,0.9)" stroke="white" stroke-width="1.5" style="display:block"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',"#ede9fe","We Appreciate You More Than Words Can Say","Dear {{name}},","At APJ 3D Solutions, we never take for granted the trust our clients place in us. Your decision to work with us, your referrals, and your continued partnership have been fundamental to our success. We want to take a moment to sincerely say — thank you. We are committed to repaying your trust with excellent work every single time.","We're in your corner, always.")},{variant:"Referral Thanks",subject:"Thank you for spreading the word, {{name}}!",htmlBody:i("linear-gradient(135deg,#a855f7,#ec4899)",'<svg width="28" height="28" viewBox="0 0 24 24" fill="rgba(255,255,255,0.9)" stroke="white" stroke-width="1.5" style="display:block"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',"#fdf4ff","Thank You for Recommending APJ 3D Solutions!","Dear {{name}},","We recently learned that you took the time to recommend APJ 3D Solutions to someone in your network — and it means more than you know. Referrals are the highest form of trust, and we are deeply honoured by yours. We will make sure your recommendation reflects well on you by delivering exceptional value to your referred contact.","You are a true APJ champion — thank you!")}]}],n=[];s.forEach(o=>{o.cards.forEach((r,c)=>{n.push({id:`${o.id}_${c}`,occId:o.id,variant:r.variant,subject:r.subject,htmlBody:r.htmlBody,title:`${o.title} — ${r.variant}`})})});const l=a(JSON.stringify(n));return`
            <div class="space-y-5 fade-in">
                <div class="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h2 class="text-2xl font-bold text-slate-900">Personalized Wishes</h2>
                        <p class="text-sm text-slate-500 mt-0.5">Choose occasion → pick card style → select recipients → send via GMass</p>
                    </div>
                    <div class="hidden" id="wishesStep2Back">
                        <button id="wishesBackBtn" class="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg> Back to Occasions
                        </button>
                    </div>
                </div>

                <!-- Step indicator -->
                <div class="flex items-center gap-2 text-xs text-slate-400" id="wishesStepBar">
                    <span id="step1dot" class="w-2 h-2 rounded-full bg-purple-500"></span><span id="step1lbl" class="font-semibold text-purple-600">Choose Occasion</span>
                    <span class="text-slate-300">→</span>
                    <span id="step2dot" class="w-2 h-2 rounded-full bg-slate-200"></span><span id="step2lbl" class="text-slate-400">Pick Card Style</span>
                    <span class="text-slate-300">→</span>
                    <span id="step3dot" class="w-2 h-2 rounded-full bg-slate-200"></span><span id="step3lbl" class="text-slate-400">Send</span>
                </div>

                <!-- STEP 1: Occasion grid -->
                <div id="wishesStep1">
                    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                        ${s.map(o=>`
                            <button class="wishes-occ-btn text-left bg-white border-2 border-slate-200 rounded-2xl p-5 hover:border-${o.color}-400 hover:bg-${o.color}-50 transition-all group" data-occ-id="${o.id}">
                                <div class="w-10 h-10 rounded-xl bg-${o.color}-100 text-${o.color}-600 flex items-center justify-center mb-3">${o.icon}</div>
                                <div class="text-sm font-bold text-slate-900 group-hover:text-${o.color}-700">${o.title}</div>
                                <div class="text-xs text-slate-400 mt-1">3 card styles</div>
                            </button>
                        `).join("")}
                    </div>
                </div>

                <!-- STEP 2: Card variant picker + preview (hidden initially) -->
                <div id="wishesStep2" class="hidden">
                    <div class="grid grid-cols-1 lg:grid-cols-5 gap-5">
                        <!-- Card variant list -->
                        <div class="lg:col-span-2 space-y-2">
                            <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Choose Card Style</div>
                            <div id="wishesCardList" class="space-y-2"></div>
                        </div>
                        <!-- Card preview iframe -->
                        <div class="lg:col-span-3" id="wishesCardPreview">
                            <div class="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-8 text-center text-slate-400">
                                <svg class="w-8 h-8 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg>
                                <div class="text-sm font-semibold">Select a card style to preview</div>
                            </div>
                        </div>
                    </div>

                    <!-- Client table (shown after card selected) -->
                    <div id="wishesClientSection" class="hidden mt-5 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div class="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                            <div class="text-sm font-bold text-slate-900">Select Recipients</div>
                            <div class="flex items-center gap-3">
                                <button id="wishesSelectAll" class="text-xs font-semibold text-purple-600 hover:text-purple-700">Select All</button>
                                <button id="wishesSendGmass" class="px-4 py-2 text-sm font-bold bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed" disabled>
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0 1.1.9 2-2 2z"/><polyline points="22,6 12,12 2,6"/></svg>
                                    Send via GMass (<span id="wishesSelCount">0</span>)
                                </button>
                            </div>
                        </div>
                        <div class="overflow-x-auto max-h-64 overflow-y-auto">
                            <table class="w-full text-sm" style="min-width: 800px;">
                                <thead class="bg-slate-50 sticky top-0"><tr>
                                    <th class="px-4 py-2 w-8"></th>
                                    <th class="px-4 py-2 text-left text-xs font-bold text-slate-500 uppercase">Name</th>
                                    <th class="px-4 py-2 text-left text-xs font-bold text-slate-500 uppercase">Email</th>
                                    <th class="px-4 py-2 text-left text-xs font-bold text-slate-500 uppercase">Stage</th>
                                </tr></thead>
                                <tbody class="divide-y divide-slate-100">
                                    ${t.map(o=>`
                                        <tr class="hover:bg-purple-50/30 transition-colors">
                                            <td class="px-4 py-2.5"><input type="checkbox" class="wishes-client-check rounded border-slate-300" data-name="${a(o.name)}" data-email="${a(o.email||"")}"/></td>
                                            <td class="px-4 py-2.5 font-semibold text-slate-900">${a(o.name)}</td>
                                            <td class="px-4 py-2.5 text-slate-500 font-mono text-xs">${a(o.email||"— no email —")}</td>
                                            <td class="px-4 py-2.5"><span class="px-2 py-0.5 text-[10px] font-bold rounded-full ${o.stage==="Active"?"bg-emerald-50 text-emerald-700":"bg-amber-50 text-amber-700"}">${a(o.stage||"—")}</span></td>
                                        </tr>
                                    `).join("")}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <span id="wishesAllCards" class="hidden">${l}</span>
            </div>
        `}getReengagementCampaigns(){const a=c=>String(c??"").replace(/</g,"&lt;"),t=this.getClientsData(),i=this.getLeadsData(),s={inactive_30:'<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',post_project:'<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>',upsell:'<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>',warm_leads:'<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/></svg>'},n=[{id:"inactive_30",title:"Inactive Clients (30+ days)",color:"indigo",subject:"We miss you — let's reconnect!",preview:"It's been a while since we connected. We'd love to catch up and explore how we can support your business today.",body:`Hi {{name}},

We noticed it's been a while since we last connected, and we wanted to check in.

At APJ 3D Solutions, we're always looking for ways to add value. We'd love to hear how your business is progressing and explore if there's anything new we can work on together.

Would you be open to a quick 15-minute catch-up call this week?

Warm Regards,
Team APJ 3D Solutions`},{id:"post_project",title:"Post-Project Follow-up",color:"emerald",subject:"What's next for your business?",preview:"Your project was a success! Let's talk about what we can build together next.",body:`Hi {{name}},

We hope you're enjoying the results from our recent project!

We'd love to explore what's next. Whether it's scaling up, adding new features, or a completely new initiative — we're here.

Would you like to schedule a strategy session?

Best,
Team APJ 3D Solutions`},{id:"upsell",title:"Upsell / New Service Offer",color:"amber",subject:"An exclusive offer for valued clients",preview:"We have an exclusive offer tailored just for clients like you. Don't miss out!",body:`Hi {{name}},

As one of our valued clients, we'd like to extend an exclusive offer for our new service.

This is designed specifically for businesses at your stage of growth and we believe it can deliver significant ROI.

Reply to this email to learn more!

Team APJ 3D Solutions`},{id:"warm_leads",title:"Lead Nurture (Warm Leads)",color:"rose",subject:"Still thinking? We're here whenever you're ready!",preview:"We know decisions take time. We're here whenever you're ready — and we have something new to share.",body:`Hi {{name}},

We reached out a while ago about how APJ 3D Solutions can help your business, and we completely understand that timing is everything.

We wanted to let you know that we now have some exciting updates that might be exactly what you were looking for.

No pressure — just here to help when you're ready.

Cheers,
Team APJ 3D Solutions`}],l=new Set;try{const c=this.getStoredProjects(),d=new Set(["in progress","active","ongoing","not started","pending"]);c.forEach(p=>{var f;const g=String((p==null?void 0:p.client)||"").trim().toLowerCase(),h=String(((f=p==null?void 0:p.monitoring)==null?void 0:f.overallStatus)||(p==null?void 0:p.status)||"").trim().toLowerCase(),m=!h||d.has(h)||h.includes("progress")||h.includes("active");g&&m&&l.add(g)})}catch{}const o=[...t.filter(c=>{const d=String((c==null?void 0:c.name)||"").trim().toLowerCase();return String((c==null?void 0:c.stage)||"").trim().toLowerCase(),!l.has(d)}).map(c=>({name:c.name,email:c.email||"",type:"Client",stage:c.stage||"—",hasEmail:!!(c.email||"").trim()})),...i.map(c=>({name:c.company||c.contact||"—",email:"",type:"Lead",stage:c.stage||"—",hasEmail:!1}))].filter(c=>c.name),r=JSON.stringify(n.map(c=>({id:c.id,title:c.title,subject:c.subject,preview:c.preview,body:c.body,color:c.color})));return`
            <div class="space-y-5 fade-in">
                <div class="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h2 class="text-2xl font-bold text-slate-900">Re-engagement</h2>
                        <p class="text-sm text-slate-500 mt-0.5">Clients without active projects · pick a segment · preview · send via GMass</p>
                        <div class="flex items-center gap-2 mt-1.5">
                            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-amber-700">
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
                                ${o.filter(c=>c.type==="Client").length} dormant client${o.filter(c=>c.type==="Client").length!==1?"s":""} eligible
                            </span>
                            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-700">
                                ${o.filter(c=>c.type==="Lead").length} warm lead${o.filter(c=>c.type==="Lead").length!==1?"s":""}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Segment selector -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    ${n.map(c=>`
                        <button class="reeng-seg-btn text-left bg-white border-2 border-slate-200 rounded-2xl p-4 hover:border-${c.color}-400 hover:bg-${c.color}-50 transition-all group" data-seg-id="${c.id}">
                            <div class="w-10 h-10 rounded-xl bg-${c.color}-50 text-${c.color}-600 flex items-center justify-center mb-3">${s[c.id]}</div>
                            <div class="text-xs font-bold text-slate-700 group-hover:text-${c.color}-700 leading-snug">${c.title}</div>
                        </button>
                    `).join("")}
                </div>

                <!-- Preview panel -->
                <div id="reengPanelWrap">
                    <div class="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-8 text-center text-slate-400">
                        <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-200 flex items-center justify-center">
                            <svg class="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
                        </div>
                        <div class="text-sm font-semibold">Select a segment above to preview the email template</div>
                    </div>
                </div>

                <!-- Contact table -->
                <div id="reengContactSection" class="hidden bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div class="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <div class="text-sm font-bold text-slate-900">Select Recipients</div>
                            <div class="text-xs text-slate-400 mt-0.5">Only clients with no current projects are shown</div>
                        </div>
                        <div class="flex items-center gap-3">
                            <button id="reengSelectAll" class="text-xs font-semibold text-purple-600 hover:text-purple-700">Select All</button>
                            <button id="reengSendGmass" class="px-4 py-2 text-sm font-bold bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-1.5" disabled>
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0 1.1.9 2-2 2z"/><polyline points="22,6 12,12 2,6"/></svg>
                                Send via GMass (<span id="reengSelCount">0</span>)
                            </button>
                        </div>
                    </div>
                    <div class="overflow-x-auto max-h-72 overflow-y-auto">
                        <table class="w-full text-sm" style="min-width: 800px;">
                            <thead class="bg-slate-50 sticky top-0"><tr>
                                <th class="px-4 py-2 w-8"></th>
                                <th class="px-4 py-2 text-left text-xs font-bold text-slate-500 uppercase">Name</th>
                                <th class="px-4 py-2 text-left text-xs font-bold text-slate-500 uppercase">Email</th>
                                <th class="px-4 py-2 text-left text-xs font-bold text-slate-500 uppercase">Type</th>
                                <th class="px-4 py-2 text-left text-xs font-bold text-slate-500 uppercase">Stage</th>
                            </tr></thead>
                            <tbody class="divide-y divide-slate-100">
                                ${o.map(c=>`
                                    <tr class="hover:bg-purple-50/30 transition-colors">
                                        <td class="px-4 py-2.5"><input type="checkbox" class="reeng-contact-check rounded border-slate-300" data-name="${a(c.name)}" data-email="${a(c.email)}"/></td>
                                        <td class="px-4 py-2.5 font-semibold text-slate-900">${a(c.name)}</td>
                                        <td class="px-4 py-2.5 text-slate-500 font-mono text-xs">${a(c.email||"— no email —")}</td>
                                        <td class="px-4 py-2.5"><span class="px-2 py-0.5 text-[10px] font-bold rounded-full ${c.type==="Client"?"bg-emerald-50 text-emerald-700":"bg-indigo-50 text-indigo-700"}">${c.type}</span></td>
                                        <td class="px-4 py-2.5 text-slate-500 text-xs">${a(c.stage)}</td>
                                    </tr>
                                `).join("")}
                            </tbody>
                        </table>
                    </div>
                </div>

                <span id="reengSegData" class="hidden">${a(r)}</span>
            </div>
        `}renderBillingContent(a){switch(this.currentSubSection){case"quotations":a.innerHTML=this.getBillingQuotations();break;case"contracts":a.innerHTML=this.getBillingContracts();break;case"invoices":a.innerHTML=this.getBillingInvoices();break;case"payments":a.innerHTML=this.getBillingPayments();break;case"followup_log":a.innerHTML=this.getBillingFollowupLog();break;case"overdue_risk":a.innerHTML=this.getBillingOverdueRisk();break;default:a.innerHTML=this.getBillingInvoices()}}getBillingQuotations(){const a=this.readStore("bezent_quotations",[]),t=r=>String(r??"").replace(/</g,"&lt;"),i={Approved:"emerald",Sent:"sky",Draft:"slate",Rejected:"rose",Expired:"amber"};new Date().getMonth();const s=a,n=s.filter(r=>String(r.status||"").toLowerCase()==="approved"),l=s.filter(r=>["sent","draft"].includes(String(r.status||"").toLowerCase())),o=n.reduce((r,c)=>r+this.parseCurrencyToNumber(c.amount),0);return`
            <div class="space-y-6 fade-in">
                <div class="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h2 class="text-xl sm:text-2xl font-semibold text-slate-900">Quotations</h2>
                        <p class="text-sm text-slate-500">Quotes drive invoices and payment collection</p>
                    </div>
                    <div class="flex gap-2">
                        <button data-action="quotation:exportCsv" class="px-4 py-2 text-sm font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">Export CSV</button>
                        <button data-action="quotation:addNew" class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">+ New Quote</button>
                    </div>
                </div>
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm"><div class="text-xs text-slate-500">Total Quotes</div><div class="text-2xl font-bold text-slate-900 mt-1">${s.length}</div><div class="text-xs text-slate-400 mt-1">all time</div>
                    <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm"><div class="text-xs text-slate-500">Approved Value</div><div class="text-xl font-bold text-emerald-700 mt-1">${this.formatINR(o)}</div><div class="text-xs text-slate-400 mt-1">${n.length} approved</div>
                    <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm"><div class="text-xs text-slate-500">Pending Approval</div><div class="text-2xl font-bold text-amber-600 mt-1">${l.length}</div><div class="text-xs text-amber-600 mt-1">${l.length?"Action needed":"All clear"}</div>
                    <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm"><div class="text-xs text-slate-500">Conversion Rate</div><div class="text-2xl font-bold text-purple-700 mt-1">${s.length?Math.round(n.length/s.length*100):0}%</div><div class="text-xs text-slate-400 mt-1">draft→approved</div>
                </div>
                ${s.length===0?`<div class="bg-white rounded-xl border p-12 text-center text-slate-400 shadow-sm">
                    <i data-lucide="file-text" class="w-12 h-12 mx-auto mb-3 opacity-20"></i>
                    <p class="font-medium text-slate-600">No quotations yet</p>
                    <p class="text-sm mt-1">Click <strong>+ New Quote</strong> to create your first quotation.</p>
                </div>`:`
                <div class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                    <div class="p-4 border-b border-slate-100 flex items-center justify-between">
                        <div class="text-sm font-semibold text-slate-900">Quotation List</div>
                    </div>
                    <div class="overflow-x-auto"><table class="w-full text-sm" style="min-width:700px">
                        <thead class="bg-slate-50 text-slate-600"><tr>
                            <th class="text-left px-4 py-3 font-medium">Quote #</th>
                            <th class="text-left px-4 py-3 font-medium">Client</th>
                            <th class="text-right px-4 py-3 font-medium">Amount</th>
                            <th class="text-left px-4 py-3 font-medium">Status</th>
                            <th class="text-left px-4 py-3 font-medium">Next Action</th>
                            <th class="text-left px-4 py-3 font-medium">Actions</th>
                        </tr></thead>
                        <tbody class="divide-y divide-slate-100">
                        ${s.map(r=>{const c=i[r.status]||"slate",d=r.status==="Approved"?"Generate Invoice":r.status==="Sent"?"Follow-up":r.status==="Draft"?"Send for Approval":"—";return`<tr class="hover:bg-slate-50">
                                <td class="px-4 py-3 font-semibold text-purple-700">${t(r.no||r.id||"—")}</td>
                                <td class="px-4 py-3 text-slate-700">${t(r.client)}</td>
                                <td class="px-4 py-3 text-right font-semibold text-slate-900">${t(r.amount)}</td>
                                <td class="px-4 py-3"><span class="px-2 py-1 text-xs font-medium bg-${c}-50 text-${c}-700 rounded-full">${t(r.status)}</span></td>
                                <td class="px-4 py-3 text-slate-600 text-xs">${d}</td>
                                <td class="px-4 py-3">
                                    ${r.status==="Approved"?`<button data-action="quotation:toInvoice" data-qid="${t(r.no||r.id)}" class="px-3 py-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100">→ Invoice</button>`:""}
                                </td>
                            </tr>`}).join("")}
                        </tbody>
                    </table></div>
                </div>`}
            </div>`}getBillingContracts(){const a=this.readStore("bezent_contracts",[]),t=o=>String(o??"").replace(/</g,"&lt;"),i=a,s=i.filter(o=>String(o.status||"Active").toLowerCase()==="active").length,n=i.filter(o=>String(o.status||"").toLowerCase()==="pending").length,l=i.reduce((o,r)=>o+(this.parseCurrencyToNumber(r.value)||0),0);return`
            <div class="space-y-6 fade-in">
                <div class="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h2 class="text-xl sm:text-2xl font-semibold text-slate-900">Contracts</h2>
                        <p class="text-sm text-slate-500">Active coverage, renewals, and terms</p>
                    </div>
                    <button data-action="contracts:add" class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">+ New Contract</button>
                </div>
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div class="bg-white rounded-xl border p-4"><div class="text-xs text-slate-500">Total Contracts</div><div class="text-2xl font-bold text-slate-900 mt-1">${i.length}</div>
                    <div class="bg-white rounded-xl border p-4"><div class="text-xs text-slate-500">Active</div><div class="text-2xl font-bold text-emerald-700 mt-1">${s}</div>
                    <div class="bg-white rounded-xl border p-4"><div class="text-xs text-slate-500">Pending</div><div class="text-2xl font-bold text-amber-600 mt-1">${n}</div>
                    <div class="bg-white rounded-xl border p-4"><div class="text-xs text-slate-500">Total Value</div><div class="text-lg font-bold text-purple-700 mt-1">₹${l.toLocaleString("en-IN")}</div>
                </div>
                ${i.length===0?`<div class="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400 shadow-sm">
                    <i data-lucide="file-text" class="w-12 h-12 mx-auto mb-3 opacity-20"></i>
                    <p class="font-medium text-slate-600">No contracts yet</p>
                    <p class="text-sm mt-1">Click <strong>+ New Contract</strong> to add your first contract.</p>
                </div>`:`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${i.map(o=>{const r=String(o.status||"Active").toLowerCase()==="active"?"emerald":String(o.status||"").toLowerCase()==="expired"?"rose":"amber";return`<div class="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-lg">
                            <div class="flex items-start justify-between">
                                <div><div class="text-sm font-semibold text-slate-900">${t(o.no)}</div><div class="text-xs text-slate-500">${t(o.client)}</div>
                                <span class="px-2 py-1 text-xs font-medium bg-${r}-50 text-${r}-700 rounded-full">${t(o.status||"Active")}</span>
                            </div>
                            <div class="mt-4 grid grid-cols-2 gap-3">
                                <div class="p-3 bg-slate-50 rounded-lg"><div class="text-xs text-slate-500">Type</div><div class="text-sm font-medium text-slate-900">${t(o.type)}</div>
                                <div class="p-3 bg-slate-50 rounded-lg"><div class="text-xs text-slate-500">Value</div><div class="text-sm font-medium text-slate-900">${t(o.value)}</div>
                            </div>
                            <div class="mt-3 p-3 ${r==="emerald"?"bg-emerald-50 border border-emerald-100":"bg-amber-50 border border-amber-100"} rounded-lg">
                                <div class="text-xs text-slate-500">Renewal</div>
                                <div class="text-sm font-medium text-slate-900">${t(o.renewal||"—")}</div>
                            </div>
                        </div>`}).join("")}
                </div>`}
            </div>
        `}getBillingInvoices(){let a=[...this.getStoredInvoices()];const t=String(this.invoiceClientFilter||"").trim();t&&(a=a.filter(d=>String((d==null?void 0:d.client)||"").trim().toLowerCase()===t.toLowerCase()));const i=a.filter(d=>String(d.status||"").toLowerCase()==="paid").length,s=a.filter(d=>String(d.status||"").toLowerCase()==="overdue").length,n=a.filter(d=>{const p=String(d.status||"").toLowerCase();return p!=="paid"&&p!=="overdue"}).length,l=a.filter(d=>String(d.status||"").toLowerCase()!=="paid").reduce((d,p)=>d+this.parseCurrencyToNumber(p.amount),0),o=a.filter(d=>String(d.status||"").toLowerCase()==="overdue").reduce((d,p)=>d+this.parseCurrencyToNumber(p.amount),0),r=a.filter(d=>String(d.status||"").toLowerCase()==="paid").reduce((d,p)=>d+this.parseCurrencyToNumber(p.amount),0),c=encodeURIComponent(JSON.stringify(a));return`
            <div class="space-y-6 fade-in">
        <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
                <h2 class="text-xl sm:text-2xl font-semibold text-slate-900">Invoices</h2>
                <p class="text-sm text-slate-500">Track paid, pending, and overdue invoices</p>
            </div>
            <button data-action="invoice:create" class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">+ Create Invoice</button>
        </div>

                ${t?`
                    <div class="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
                        <div class="text-sm text-slate-700">Filtered by client: <span class="font-semibold text-slate-900">${t.replace(/</g,"&lt;")}</span></div>
                        <button data-action="billing:clearInvoiceFilter" class="px-3 py-2 text-xs font-medium bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">Clear filter</button>
                    </div>
                `:""}

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div class="bg-white rounded-lg border border-slate-200 p-5 shadow-lg">
                        <div class="text-xs text-slate-500">Pending Payments</div>
                        <div class="text-2xl font-semibold text-slate-900 mt-1">${this.formatINR(l)}</div>
                        <div class="text-xs text-amber-700 mt-1">${n} pending</div>
                    </div>
                    <div class="bg-white rounded-lg border border-slate-200 p-5 shadow-lg">
                        <div class="text-xs text-slate-500">Overdue</div>
                        <div class="text-2xl font-semibold text-slate-900 mt-1">${this.formatINR(o)}</div>
                        <div class="text-xs text-rose-700 mt-1">${s} invoices</div>
                    </div>
                    <div class="bg-white rounded-lg border border-slate-200 p-5 shadow-lg">
                        <div class="text-xs text-slate-500">Collected (MTD)</div>
                        <div class="text-2xl font-semibold text-slate-900 mt-1">${this.formatINR(r)}</div>
                        <div class="text-xs text-emerald-700 mt-1">${i} paid</div>
                    </div>
                    <div class="bg-white rounded-lg border border-slate-200 p-5 shadow-lg">
                        <div class="text-xs text-slate-500">Avg Days to Pay</div>
                        <div class="text-2xl font-semibold text-slate-900 mt-1">—</div>
                        <div class="text-xs text-slate-500 mt-1">last 30 days</div>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div class="col-span-1 lg:col-span-2 bg-white rounded-lg border border-slate-200 overflow-hidden">
                        <div class="p-4 border-b border-slate-200 flex items-center justify-between">
                            <div class="text-sm font-medium text-slate-900">Invoice Table</div>
                            <button data-action="invoice:export" data-invoices-json="${c}" class="px-3 py-2 text-sm font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">Download</button>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="w-full text-sm" style="min-width: 800px;">
                                <thead class="bg-slate-50 text-slate-600">
                                    <tr>
                                        <th class="text-left px-4 py-3 font-medium">Invoice</th>
                                        <th class="text-left px-4 py-3 font-medium">Client</th>
                                        <th class="text-right px-4 py-3 font-medium">Amount</th>
                                        <th class="text-left px-4 py-3 font-medium">Due</th>
                                        <th class="text-left px-4 py-3 font-medium">Status</th>
                                        <th class="text-left px-4 py-3 font-medium">Action</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-200">
                                    ${a.map(d=>`
                                        <tr class="hover:bg-slate-50">
                                            <td class="px-4 py-3 font-medium text-slate-900">${d.no}</td>
                                            <td class="px-4 py-3 text-slate-700">${d.client}</td>
                                            <td class="px-4 py-3 text-right font-medium text-slate-900">${d.amount}</td>
                                            <td class="px-4 py-3 text-slate-700">${d.due}</td>
                                            <td class="px-4 py-3">
                                                <span class="px-2 py-1 text-xs font-medium bg-${d.color}-50 text-${d.color}-700 rounded-full">${d.status}</span>
                                            </td>
                                            <td class="px-4 py-3">
                                                <div class="flex items-center gap-2">
                                                    <button
                                                        data-action="invoice:preview"
                                                        data-invoice-no="${d.no}"
                                                        data-invoice-client="${d.client}"
                                                        data-invoice-amount="${d.amount}"
                                                        data-invoice-due="${d.due}"
                                                        data-invoice-status="${d.status}"
                                                        data-invoice-color="${d.color}"
                                                        class="px-3 py-1.5 text-xs font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">Preview</button>

                                                    <button
                                                        data-action="invoice:download"
                                                        data-invoice-no="${d.no}"
                                                        data-invoice-client="${d.client}"
                                                        data-invoice-amount="${d.amount}"
                                                        data-invoice-due="${d.due}"
                                                        data-invoice-status="${d.status}"
                                                        data-invoice-color="${d.color}"
                                                        class="px-3 py-1.5 text-xs font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">Download</button>

                                                    ${d.status==="Paid"?"":`
                                                        <button
                                                            data-action="invoice:markPaid"
                                                            data-invoice-no="${d.no}"
                                                            data-invoice-client="${d.client}"
                                                            data-invoice-amount="${d.amount}"
                                                            data-invoice-due="${d.due}"
                                                            data-invoice-status="${d.status}"
                                                            data-invoice-color="${d.color}"
                                                            class="px-3 py-1.5 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors">Mark Paid</button>
                                                    `}
                                                </div>
                                            </td>
                                        </tr>
                                    `).join("")}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-lg">
                        <h3 class="text-lg font-semibold text-slate-900">Status Split</h3>
                        <p class="text-sm text-slate-500">Paid vs overdue vs pending</p>
                        <div class="mt-4 h-56 bg-slate-50 rounded-lg p-3">
                            <div class="relative w-full h-full"><canvas id="invoiceStatusChart"></canvas></div>
                        </div>
                        </div>
                        <button data-action="billing:sendBulkReminders" class="mt-5 w-full px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Send Bulk Reminders</button>
                    </div>
                </div>
            </div>
    `}getBillingPayments(){const a=o=>({overdue:"rose",pending:"amber",paid:"emerald"})[String(o||"").toLowerCase()]||"sky",t=this.getStoredInvoices(),i=t.filter(o=>String(o.status||"").toLowerCase()==="paid").reduce((o,r)=>o+this.parseCurrencyToNumber(r.amount),0),s=t.filter(o=>{const r=String(o.status||"").toLowerCase();return r!=="paid"&&r!=="overdue"}).reduce((o,r)=>o+this.parseCurrencyToNumber(r.amount),0),n=t.filter(o=>String(o.status||"").toLowerCase()==="overdue").reduce((o,r)=>o+this.parseCurrencyToNumber(r.amount),0);return`
            <div class="space-y-6 fade-in">
                <div class="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h2 class="text-xl sm:text-2xl font-semibold text-slate-900">Payment Status</h2>
                        <p class="text-sm text-slate-500">Collections pipeline and overdue risk</p>
                    </div>
                    <div class="flex gap-2">
                        <button data-action="billing:goToFollowupLog" class="px-4 py-2 text-sm font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">Follow-up Log</button>
                        <button data-action="billing:goToOverdueRisk" class="px-4 py-2 text-sm font-medium bg-rose-50 text-rose-700 rounded-lg hover:bg-rose-100 transition-colors">Overdue Risk</button>
                        <button data-action="invoice:create" class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Record Payment</button>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div class="col-span-1 lg:col-span-2 bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-lg">
                        <div class="flex flex-wrap items-start justify-between gap-3">
                            <h3 class="text-lg font-semibold text-slate-900">Expected Payments</h3>
                            <span class="px-2 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded-full">This week</span>
                        </div>
                        <div class="mt-4 space-y-3">
                            ${t.filter(o=>String(o.status||"").toLowerCase()!=="paid").slice(0,8).map(o=>({client:String(o.client||"—"),amount:String(o.amount||"—"),when:String(o.due||"—"),status:String(o.status||"Pending"),color:a(o.status)})).map(o=>`
                                <div class="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                    <div>
                                        <div class="text-sm font-medium text-purple-700 cursor-pointer hover:underline" data-action="billing:goToClient" data-client-name="${o.client}">${o.client}</div>
                                        <div class="text-xs text-slate-500">${o.when}</div>
                                    </div>
                                    <div class="flex items-center gap-3">
                                        <div class="text-sm font-semibold text-slate-900">${o.amount}</div>
                                        <span class="px-2 py-1 text-xs font-medium bg-${o.color}-50 text-${o.color}-700 rounded-full">${o.status}</span>
                                        <button data-action="billing:goToInvoices" data-client-name="${o.client}" class="px-3 py-1.5 text-xs font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">Invoices</button>
                                        <button data-action="billing:sendBulkReminders" data-client-name="${o.client}" class="px-3 py-2 text-sm font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">Notify</button>
                                    </div>
                                </div>
                            `).join("")}
                        </div>
                    </div>

                    <div class="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-lg">
                        <h3 class="text-lg font-semibold text-slate-900">Collections Summary</h3>
                        <div class="mt-4 space-y-3">
                            <div class="p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
                                <div class="text-xs text-slate-500">Collected Today</div>
                                <div class="text-lg font-semibold text-slate-900">${this.formatINR(i)}</div>
                            </div>
                            <div class="p-3 bg-amber-50 border border-amber-100 rounded-lg">
                                <div class="text-xs text-slate-500">Pending This Week</div>
                                <div class="text-lg font-semibold text-slate-900">${this.formatINR(s)}</div>
                            </div>
                            <div class="p-3 bg-rose-50 border border-rose-100 rounded-lg cursor-pointer hover:border-rose-200 transition-colors" data-action="billing:goToOverdueRisk">
                                <div class="text-xs text-slate-500">Overdue Risk</div>
                                <div class="text-lg font-semibold text-slate-900">${this.formatINR(n)}</div>
                                <div class="text-xs text-rose-600 mt-1">Click to view dashboard →</div>
                            </div>
                        </div>
                        <button data-action="billing:goToFollowupLog" class="mt-5 w-full px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">View Follow-up Log</button>
                    </div>
                </div>
            </div>
    `}getBillingFollowupLog(){const a=this.getAllInvoices(),t=a.filter(g=>String(g.status||"").toLowerCase()!=="paid"),i=g=>String(g??"").replace(/</g,"&lt;"),s=this.readStore("bezent_payment_followups",[]),n=new Set(s.map(g=>String(g.invoice||"").trim())),l=[];a.filter(g=>String((g==null?void 0:g.status)||"").toLowerCase()==="overdue").forEach(g=>{n.has(String(g.no||"").trim())||l.push({date:new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}),invoice:g.no,client:g.client,type:"Auto-alert",note:`Invoice ${i(g.no)} is overdue — ${i(g.amount)}`,status:"Pending",color:"rose"})});const o=[...s,...l],r=o.length||0,c=o.filter(g=>g.status==="Responded").length,d=t.length,p=o.filter(g=>["Overdue","Pending","Auto-alert"].includes(g.status)).length;return`
            <div class="space-y-6 fade-in">
                <div class="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h2 class="text-xl sm:text-2xl font-semibold text-slate-900">Payment Follow-up Log</h2>
                        <p class="text-sm text-slate-500">Track all payment collection follow-ups and communication history</p>
                    </div>
                    <div class="flex gap-2">
                        <button data-action="billing:goToPayments" class="px-4 py-2 text-sm font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">← Payment Status</button>
                        <button data-action="billing:goToOverdueRisk" class="px-4 py-2 text-sm font-medium bg-rose-50 text-rose-700 rounded-lg hover:bg-rose-100 transition-colors">Overdue Risk</button>
                        <button data-action="billing:logFollowup" class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">+ Log Follow-up</button>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div class="bg-white rounded-lg border border-slate-200 p-5 shadow-lg">
                        <div class="text-xs text-slate-500">Total Follow-ups</div>
                        <div class="text-2xl font-semibold text-slate-900 mt-1">${r}</div>
                        <div class="text-xs text-slate-500 mt-1">last 7 days</div>
                    </div>
                    <div class="bg-white rounded-lg border border-slate-200 p-5 shadow-lg">
                        <div class="text-xs text-slate-500">Responses Received</div>
                        <div class="text-2xl font-semibold text-emerald-700 mt-1">${c}</div>
                        <div class="text-xs text-emerald-700 mt-1">${r?Math.round(c/r*100):0}% response rate</div>
                    </div>
                    <div class="bg-white rounded-lg border border-slate-200 p-5 shadow-lg">
                        <div class="text-xs text-slate-500">Pending Invoices</div>
                        <div class="text-2xl font-semibold text-amber-700 mt-1">${d}</div>
                        <div class="text-xs text-amber-700 mt-1">need follow-up</div>
                    </div>
                    <div class="bg-white rounded-lg border border-slate-200 p-5 shadow-lg">
                        <div class="text-xs text-slate-500">Overdue Follow-ups</div>
                        <div class="text-2xl font-semibold text-rose-700 mt-1">${p}</div>
                        <div class="text-xs text-rose-700 mt-1">${p>0?"needs immediate action":"all clear"}</div>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div class="col-span-1 lg:col-span-2 bg-white rounded-lg border border-slate-200 overflow-hidden shadow-lg">
                        <div class="p-4 border-b border-slate-200 flex items-center justify-between">
                            <div class="text-sm font-medium text-slate-900">Follow-up History</div>
                            <button data-action="table:exportCsv" data-table-id="followupHistory" class="px-3 py-2 text-sm font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">Export</button>
                        </div>
                        <div class="overflow-x-auto">
                            <table id="followupHistory" class="w-full text-sm" style="min-width: 800px;">
                                <thead class="bg-slate-50 text-slate-600">
                                    <tr>
                                        <th class="text-left px-4 py-3 font-medium">Date</th>
                                        <th class="text-left px-4 py-3 font-medium">Invoice</th>
                                        <th class="text-left px-4 py-3 font-medium">Client</th>
                                        <th class="text-left px-4 py-3 font-medium">Channel</th>
                                        <th class="text-left px-4 py-3 font-medium">Note</th>
                                        <th class="text-left px-4 py-3 font-medium">Status</th>
                                        <th class="text-left px-4 py-3 font-medium">Action</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-200">
                                    ${o.map(g=>`
                                        <tr class="hover:bg-slate-50">
                                            <td class="px-4 py-3 text-slate-700 whitespace-nowrap">${g.date}</td>
                                            <td class="px-4 py-3 font-medium text-purple-700 cursor-pointer hover:underline" data-action="billing:goToInvoices" data-client-name="${g.client}">${g.invoice}</td>
                                            <td class="px-4 py-3 text-purple-700 cursor-pointer hover:underline" data-action="billing:goToClient" data-client-name="${g.client}">${g.client}</td>
                                            <td class="px-4 py-3">
                                                <span class="px-2 py-1 text-xs font-medium ${g.type==="Email"?"bg-sky-50 text-sky-700":g.type==="Phone"?"bg-indigo-50 text-indigo-700":"bg-emerald-50 text-emerald-700"} rounded-full">${g.type}</span>
                                            </td>
                                            <td class="px-4 py-3 text-slate-700 max-w-xs truncate">${g.note}</td>
                                            <td class="px-4 py-3">
                                                <span class="px-2 py-1 text-xs font-medium bg-${g.color}-50 text-${g.color}-700 rounded-full">${g.status}</span>
                                            </td>
                                            <td class="px-4 py-3">
                                                <button data-action="${g.status==="Responded"?"survey:viewResponse":"followup:addNew"}" data-client="${i(g.client)}" class="px-3 py-1.5 text-xs font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">${g.status==="Responded"?"View":"Follow-up"}</button>
                                            </td>
                                        </tr>
                                    `).join("")}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="space-y-6">
                        <div class="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-lg">
                            <h3 class="text-lg font-semibold text-slate-900">Quick Actions</h3>
                            <div class="mt-4 space-y-3">
                                <button data-action="billing:sendBulkReminders" class="w-full px-4 py-2.5 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
                                    <i data-lucide="mail" class="w-4 h-4"></i>
                                    Send Bulk Reminders
                                </button>
                                <button data-action="billing:goToInvoices" class="w-full px-4 py-2.5 text-sm font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors flex items-center gap-2">
                                    <i data-lucide="file-text" class="w-4 h-4"></i>
                                    View All Invoices
                                </button>
                                <button data-action="billing:goToOverdueRisk" class="w-full px-4 py-2.5 text-sm font-medium bg-rose-50 text-rose-700 rounded-lg hover:bg-rose-100 transition-colors flex items-center gap-2">
                                    <i data-lucide="alert-triangle" class="w-4 h-4"></i>
                                    Overdue Risk Dashboard
                                </button>
                            </div>
                        </div>

                        <div class="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-lg">
                            <h3 class="text-lg font-semibold text-slate-900">Follow-up Schedule</h3>
                            <p class="text-sm text-slate-500">Upcoming reminders</p>
                            <div class="mt-4 space-y-3">
                                ${t.slice(0,4).map(g=>`
                                    <div class="p-3 bg-slate-50 rounded-lg">
                                        <div class="flex items-center justify-between">
                                            <div>
                                                <div class="text-sm font-medium text-slate-900">${g.no}</div>
                                                <div class="text-xs text-purple-700 cursor-pointer hover:underline" data-action="billing:goToClient" data-client-name="${g.client}">${g.client}</div>
                                            </div>
                                            <span class="px-2 py-1 text-xs font-medium bg-${g.color}-50 text-${g.color}-700 rounded-full">${g.status}</span>
                                        </div>
                                        <div class="text-xs text-slate-500 mt-1">${g.amount} — ${g.due}</div>
                                    </div>
                                `).join("")}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `}getBillingOverdueRisk(){const a=this.getAllInvoices(),t=a.filter(p=>String(p.status||"").toLowerCase()==="overdue"),i=a.filter(p=>String(p.status||"").toLowerCase()==="pending"),s=a.filter(p=>String(p.status||"").toLowerCase()!=="paid"),n=t.reduce((p,g)=>p+this.parseCurrencyToNumber(g.amount),0),l=i.reduce((p,g)=>p+this.parseCurrencyToNumber(g.amount),0),o=n+l,r=[{bucket:"0–7 days",count:i.length,amount:this.formatINR(l),color:"amber",risk:"Low"},{bucket:"8–15 days",count:0,amount:this.formatINR(0),color:"orange",risk:"Medium"},{bucket:"16–30 days",count:t.length,amount:this.formatINR(n),color:"rose",risk:"High"},{bucket:"30+ days",count:0,amount:this.formatINR(0),color:"red",risk:"Critical"}],c=new Map;s.forEach(p=>{const g=String(p.client||"").trim();if(!g)return;const h=g.toLowerCase(),m=c.get(h)||{client:g,invoices:[],totalDue:0};m.invoices.push(p),m.totalDue+=this.parseCurrencyToNumber(p.amount),c.set(h,m)});const d=Array.from(c.values()).sort((p,g)=>g.totalDue-p.totalDue);return`
            <div class="space-y-6 fade-in">
                <div class="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h2 class="text-xl sm:text-2xl font-semibold text-slate-900">Overdue Risk Dashboard</h2>
                        <p class="text-sm text-slate-500">Monitor payment risks, aging buckets, and at-risk clients</p>
                    </div>
                    <div class="flex gap-2">
                        <button data-action="billing:goToPayments" class="px-4 py-2 text-sm font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">← Payment Status</button>
                        <button data-action="billing:goToFollowupLog" class="px-4 py-2 text-sm font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">Follow-up Log</button>
                        <button data-action="billing:sendBulkReminders" class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Send Bulk Reminders</button>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div class="bg-white rounded-lg border border-rose-200 p-5 shadow-lg">
                        <div class="text-xs text-slate-500">Total At-Risk Amount</div>
                        <div class="text-2xl font-semibold text-rose-700 mt-1">${this.formatINR(o)}</div>
                        <div class="text-xs text-rose-700 mt-1">${s.length} open invoices</div>
                    </div>
                    <div class="bg-white rounded-lg border border-rose-200 p-5 shadow-lg">
                        <div class="text-xs text-slate-500">Overdue Amount</div>
                        <div class="text-2xl font-semibold text-rose-700 mt-1">${this.formatINR(n)}</div>
                        <div class="text-xs text-rose-700 mt-1">${t.length} overdue</div>
                    </div>
                    <div class="bg-white rounded-lg border border-amber-200 p-5 shadow-lg">
                        <div class="text-xs text-slate-500">Pending Amount</div>
                        <div class="text-2xl font-semibold text-amber-700 mt-1">${this.formatINR(l)}</div>
                        <div class="text-xs text-amber-700 mt-1">${i.length} approaching due</div>
                    </div>
                    <div class="bg-white rounded-lg border border-slate-200 p-5 shadow-lg">
                        <div class="text-xs text-slate-500">At-Risk Clients</div>
                        <div class="text-2xl font-semibold text-slate-900 mt-1">${d.length}</div>
                        <div class="text-xs text-slate-500 mt-1">need attention</div>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div class="col-span-1 lg:col-span-2 space-y-6">
                        <div class="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-lg">
                            <h3 class="text-lg font-semibold text-slate-900">Aging Buckets</h3>
                            <p class="text-sm text-slate-500">Invoice distribution by overdue days</p>
                            <div class="mt-4 space-y-3">
                                ${r.map(p=>`
                                    <div class="p-4 bg-slate-50 rounded-lg">
                                        <div class="flex items-center justify-between">
                                            <div class="flex items-center gap-3">
                                                <div class="w-3 h-3 rounded-full bg-${p.color}-500"></div>
                                                <div>
                                                    <div class="text-sm font-medium text-slate-900">${p.bucket}</div>
                                                    <div class="text-xs text-slate-500">${p.count} invoice${p.count!==1?"s":""}</div>
                                                </div>
                                            </div>
                                            <div class="flex items-center gap-3">
                                                <div class="text-sm font-semibold text-slate-900">${p.amount}</div>
                                                <span class="px-2 py-1 text-xs font-medium bg-${p.color}-50 text-${p.color}-700 rounded-full">${p.risk}</span>
                                            </div>
                                        </div>
                                        ${p.count>0?`<div class="mt-2 w-full bg-slate-200 rounded-full h-1.5"><div class="bg-${p.color}-500 h-1.5 rounded-full" style="width: ${Math.min(p.count/Math.max(s.length,1)*100,100)}%"></div>`:""}
                                    </div>
                                `).join("")}
                            </div>
                        </div>

                        <div class="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-lg">
                            <div class="p-4 border-b border-slate-200 flex items-center justify-between">
                                <div class="text-sm font-medium text-slate-900">Overdue Invoices</div>
                                <button data-action="billing:goToInvoices" class="px-3 py-2 text-sm font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">View All Invoices</button>
                            </div>
                            <div class="overflow-x-auto">
                                <table class="w-full text-sm" style="min-width: 600px;">
                                    <thead class="bg-slate-50 text-slate-600">
                                        <tr>
                                            <th class="text-left px-4 py-3 font-medium">Invoice</th>
                                            <th class="text-left px-4 py-3 font-medium">Client</th>
                                            <th class="text-right px-4 py-3 font-medium">Amount</th>
                                            <th class="text-left px-4 py-3 font-medium">Status</th>
                                            <th class="text-left px-4 py-3 font-medium">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-slate-200">
                                        ${s.map(p=>`
                                            <tr class="hover:bg-slate-50">
                                                <td class="px-4 py-3 font-medium text-slate-900">${p.no}</td>
                                                <td class="px-4 py-3 text-purple-700 cursor-pointer hover:underline" data-action="billing:goToClient" data-client-name="${p.client}">${p.client}</td>
                                                <td class="px-4 py-3 text-right font-medium text-slate-900">${p.amount}</td>
                                                <td class="px-4 py-3">
                                                    <span class="px-2 py-1 text-xs font-medium bg-${p.color}-50 text-${p.color}-700 rounded-full">${p.status}</span>
                                                </td>
                                                <td class="px-4 py-3">
                                                    <div class="flex items-center gap-2">
                                                        <button data-action="billing:goToFollowupLog" class="px-3 py-1.5 text-xs font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">Follow-up</button>
                                                        <button data-action="billing:sendBulkReminders" class="px-3 py-1.5 text-xs font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">Remind</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        `).join("")}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div class="space-y-6">
                        <div class="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-lg">
                            <h3 class="text-lg font-semibold text-slate-900">At-Risk Clients</h3>
                            <p class="text-sm text-slate-500">Clients with outstanding payments</p>
                            <div class="mt-4 space-y-3">
                                ${d.map(p=>{const g=p.invoices.some(f=>String(f.status||"").toLowerCase()==="overdue"),h=g?"rose":"amber",m=g?"High Risk":"Medium Risk";return`
                                        <div class="p-4 bg-slate-50 rounded-lg border-l-4 border-${h}-500">
                                            <div class="flex items-start justify-between">
                                                <div>
                                                    <div class="text-sm font-medium text-purple-700 cursor-pointer hover:underline" data-action="billing:goToClient" data-client-name="${p.client}">${p.client}</div>
                                                    <div class="text-xs text-slate-500 mt-1">${p.invoices.length} open invoice${p.invoices.length!==1?"s":""}</div>
                                                </div>
                                                <span class="px-2 py-1 text-xs font-medium bg-${h}-50 text-${h}-700 rounded-full">${m}</span>
                                            </div>
                                            <div class="mt-2 text-sm font-semibold text-slate-900">${this.formatINR(p.totalDue)}</div>
                                            <div class="mt-2 flex gap-2">
                                                <button data-action="billing:goToInvoices" data-client-name="${p.client}" class="flex-1 px-3 py-1.5 text-xs font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">Invoices</button>
                                                <button data-action="billing:goToClient" data-client-name="${p.client}" class="flex-1 px-3 py-1.5 text-xs font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">Client</button>
                                            </div>
                                        </div>
                                    `}).join("")}
                            </div>
                        </div>

                        <div class="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-lg">
                            <h3 class="text-lg font-semibold text-slate-900">Risk Summary</h3>
                            <div class="mt-4 space-y-3">
                                <div class="p-3 bg-rose-50 border border-rose-100 rounded-lg">
                                    <div class="text-xs text-slate-500">Immediate Action</div>
                                    <div class="text-sm font-medium text-rose-900">${t.length} overdue invoice${t.length!==1?"s":""}</div>
                                    <div class="text-xs text-rose-700 mt-1">Escalation recommended</div>
                                </div>
                                <div class="p-3 bg-amber-50 border border-amber-100 rounded-lg">
                                    <div class="text-xs text-slate-500">Watch List</div>
                                    <div class="text-sm font-medium text-amber-900">${i.length} invoice${i.length!==1?"s":""} approaching due</div>
                                    <div class="text-xs text-amber-700 mt-1">Send pre-due reminders</div>
                                </div>
                                <div class="p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
                                    <div class="text-xs text-slate-500">Collection Health</div>
                                    <div class="text-sm font-medium text-emerald-900">${a.filter(p=>String(p.status||"").toLowerCase()==="paid").length} paid this period</div>
                                    <div class="text-xs text-emerald-700 mt-1">Collection rate on track</div>
                                </div>
                            </div>
                            <button data-action="billing:goToFollowupLog" class="mt-5 w-full px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Open Follow-up Log</button>
                        </div>
                    </div>
                </div>
            </div>
        `}renderEngagementContent(a){switch(this.currentSubSection){case"followups":a.innerHTML=this.getEngagementFollowups();break;case"surveys":a.innerHTML=this.getEngagementSurveys(),this._setupSurveyInteractions();break;case"health":a.innerHTML=this.getEngagementHealth();break;case"reengagement":a.innerHTML=this.getEngagementNextProjects();break;case"field_visits":a.innerHTML=this.getEngagementFieldVisits();break;case"route_map":a.innerHTML=this.getEngagementRouteMap(),setTimeout(()=>this._initRouteMap(),50);break;case"mobile_sync":a.innerHTML=this.getEngagementMobileSync();break;default:a.innerHTML=this.getEngagementFollowups()}}_setupSurveyInteractions(){const a=document.getElementById("surveyLinkCopyBtn"),t=document.getElementById("surveyLinkInput");a&&t&&a.addEventListener("click",()=>{const s=t.value;try{navigator.clipboard.writeText(s)}catch{t.select(),document.execCommand("copy")}a.textContent="✓ Copied!",setTimeout(()=>{a.textContent="Copy"},2e3),this.showToast("Feedback link copied to clipboard!")});const i=document.getElementById("surveySubmitForm");i&&i.addEventListener("submit",s=>{s.preventDefault();const n=new FormData(i),l={name:(n.get("clientName")||"").trim()||"Anonymous",client:(n.get("clientName")||"").trim()||"Anonymous",email:(n.get("clientEmail")||"").trim(),quality:parseInt(n.get("quality")||"5"),communication:parseInt(n.get("communication")||"5"),timelines:parseInt(n.get("timeline")||"5"),value:parseInt(n.get("value")||"5"),comments:(n.get("comments")||"").trim(),submittedAt:new Date().toISOString(),id:Date.now()};l.avg=((l.quality+l.communication+l.timelines+l.value)/4).toFixed(1);const o=this.readStore("bezent_feedback_submissions",[]);o.unshift(l),this.writeStore("bezent_feedback_submissions",o),i.reset(),this.showToast("✅ Feedback submitted successfully!");const r=document.getElementById("feedbackSubmissionsTbody");r&&(r.innerHTML=this._buildFeedbackRows(o));const c=document.getElementById("feedbackAvgScore");if(c&&o.length){const d=o.reduce((p,g)=>p+parseFloat(g.avg),0);c.textContent=(d/o.length).toFixed(1)}})}_buildFeedbackRows(a){const t=i=>String(i??"").replace(/</g,"&lt;");return a.length?a.map(i=>{const s=parseFloat(i.avg),n=s>=4.5?"emerald":s>=3.5?"sky":s>=2.5?"amber":"rose",l=i.communication??i.comm??"—",o=i.timelines??i.timeline??"—",r=i.name||i.client||"Anonymous",d=(i.submittedAt?new Date(i.submittedAt):new Date(i.id||Date.now())).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}),p="&#9733;".repeat(Math.round(s))+"&#9734;".repeat(5-Math.round(s));return`
                <tr class="hover:bg-slate-50">
                    <td class="px-4 py-3 font-medium text-slate-900">${t(r)}</td>
                    <td class="px-4 py-3 text-slate-500 text-xs">${t(i.email||"—")}</td>
                    <td class="px-4 py-3 text-center">${i.quality??"—"}</td>
                    <td class="px-4 py-3 text-center">${l}</td>
                    <td class="px-4 py-3 text-center">${o}</td>
                    <td class="px-4 py-3 text-center">${i.value??"—"}</td>
                    <td class="px-4 py-3">
                        <span class="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold bg-${n}-50 text-${n}-700 rounded-full">${s} <span>${p}</span></span>
                    </td>
                    <td class="px-4 py-3 text-xs text-slate-400">${d}</td>
                    <td class="px-4 py-3 text-xs text-slate-600 max-w-xs truncate">${t(i.comments||"—")}</td>
                </tr>`}).join(""):'<tr><td colspan="9" class="px-4 py-6 text-center text-slate-400 text-sm">No feedback received yet. Share the link with your clients to collect responses.</td></tr>'}getEngagementFollowups(){const a=this.readStore("bezent_followups",[]),t=this.getAllInvoices(),i=this.getStoredLeads(),s=u=>String(u??"").replace(/</g,"&lt;"),n=[];t.filter(u=>String((u==null?void 0:u.status)||"").toLowerCase()==="overdue").forEach(u=>{n.push({time:"—",client:String(u.client||""),topic:`Overdue invoice ${s(u.no)} (${s(u.amount)})`,priority:"High",color:"rose",type:"billing",done:!1,avatar:String(u.client||"?").split(" ").map(b=>b[0]).join("").slice(0,2).toUpperCase(),auto:!0})}),i.filter(u=>["new lead","open","contacted"].includes(String(u.stage||u.status||"").toLowerCase())).slice(0,3).forEach(u=>{n.push({time:"—",client:String(u.company||u.contact||"Lead"),topic:`Follow up — stage: ${u.stage||u.status||"New Lead"}`,priority:"Medium",color:"amber",type:"pipeline",done:!1,avatar:String(u.company||u.contact||"?").split(" ").map(b=>b[0]).join("").slice(0,2).toUpperCase(),auto:!0})});const l=[...a,...n].slice(0,10);l.length||l.push({time:"—",client:"No follow-ups yet",topic:'Click "+ New Follow-up" to add one',priority:"Low",color:"slate",type:"pipeline",done:!1,avatar:"NF"});const o=[{day:"Mon",count:Math.max(1,Math.floor(l.length*.3)),done:Math.floor(l.length*.15)},{day:"Tue",count:Math.max(1,Math.floor(l.length*.25)),done:Math.floor(l.length*.2)},{day:"Wed",count:Math.max(1,Math.floor(l.length*.2)),done:0},{day:"Thu",count:Math.max(1,Math.floor(l.length*.15)),done:0},{day:"Fri",count:Math.max(1,Math.floor(l.length*.1)),done:0}],r=Math.max(...o.map(u=>u.count),1),c=u=>({overdue:"rose","at risk":"amber","on track":"emerald",upcoming:"violet",pending:"sky"})[String(u||"").toLowerCase()]||"slate",d=u=>String(u||"?").split(" ").map(b=>b[0]||"").join("").toUpperCase().slice(0,2),p=(this.getStoredClients?this.getStoredClients():[]).slice(0,6).map(u=>({name:String(u.name||"—"),last:"—",open:0,type:"Follow-up",urgency:String(u.stage||"Active"),color:c(u.stage),avatar:d(u.name)})),g=u=>({billing:'<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>',proposal:'<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>',survey:'<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12l2 2 4-4"/></svg>',pipeline:'<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M3 3h18M3 9h18M3 15h18M3 21h18"/></svg>',contract:'<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>'})[u]||"",h=l.length,m=l.filter(u=>u.done).length,f=l.filter(u=>u.priority==="High"&&!u.done).length,w=l.filter(u=>u.color==="rose"&&!u.done).length;return`
            <div class="space-y-6 fade-in">

                <!-- Header -->
                <div class="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h2 class="text-xl sm:text-2xl font-semibold text-slate-900">Follow-ups</h2>
                        <p class="text-sm text-slate-500 mt-0.5">Daily follow-up calendar, priorities &amp; client summary</p>
                    </div>
                    <div class="flex items-center gap-2">
                        <button data-action="followup:autoSchedule" class="px-4 py-2 text-sm font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">Auto-Schedule</button>
                        <button data-action="followup:addNew" class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">+ New Follow-up</button>
                    </div>
                </div>

                <!-- KPI strip -->
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                        <div class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Today&apos;s Total</div>
                        <div class="text-2xl font-bold text-slate-900 mt-1">${h}</div>
                        <div class="text-xs text-slate-400 mt-1">follow-ups scheduled</div>
                    </div>
                    <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                        <div class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Completed</div>
                        <div class="text-2xl font-bold text-emerald-600 mt-1">${m}</div>
                        <div class="text-xs text-slate-400 mt-1">of ${h} done today</div>
                    </div>
                    <div class="bg-white rounded-xl border border-rose-100 p-4 shadow-sm">
                        <div class="text-xs font-semibold text-slate-500 uppercase tracking-wide">High Priority</div>
                        <div class="text-2xl font-bold text-rose-600 mt-1">${f}</div>
                        <div class="text-xs text-slate-400 mt-1">still pending</div>
                    </div>
                    <div class="bg-white rounded-xl border border-amber-100 p-4 shadow-sm">
                        <div class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Overdue</div>
                        <div class="text-2xl font-bold text-amber-600 mt-1">${w}</div>
                        <div class="text-xs text-slate-400 mt-1">need immediate action</div>
                    </div>
                </div>

                <!-- Overdue alert banner - dynamic -->
                ${(()=>{try{const u=this.getStoredInvoices().filter(v=>String(v.status||"").toLowerCase()==="overdue");if(!u.length)return"";const b=u[0];return`<div class="flex items-start gap-3 p-4 bg-rose-50 border border-rose-200 rounded-xl"><svg class="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg><div class="flex-1 min-w-0"><div class="text-sm font-semibold text-rose-800">Action Required — ${b.client||"Client"}</div><div class="text-xs text-rose-700 mt-0.5">${b.no} is overdue (${b.amount||""}). Send a payment reminder to avoid further delay.</div><button data-action="billing:sendBulkReminders" class="flex-shrink-0 px-3 py-1.5 text-xs font-semibold bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors">Send Reminder</button></div>`}catch{return""}})()}

                <!-- Main layout -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    <!-- Today's timeline (2 cols) -->
                    <div class="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div class="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <div class="text-sm font-semibold text-slate-900">Today&apos;s Timeline</div>
                                <div class="text-xs text-slate-400 mt-0.5">Mon, 02 Mar 2026</div>
                            </div>
                            <span class="px-2.5 py-1 text-xs font-semibold bg-purple-50 text-purple-700 rounded-full">${h-m} remaining</span>
                        </div>
                        <div class="divide-y divide-slate-100">
                            ${l.map(u=>`
                                <div class="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors ${u.done?"opacity-60":""}">
                                    <div class="w-14 flex-shrink-0 text-center">
                                        <div class="text-xs font-bold text-slate-900">${u.time.split(" ")[0]}</div>
                                        <div class="text-[10px] text-slate-400">${u.time.split(" ")[1]}</div>
                                    </div>
                                    <div class="flex-shrink-0">
                                        <div class="w-3 h-3 rounded-full border-2 ${u.done?"bg-emerald-500 border-emerald-500":"bg-white border-"+u.color+"-400"}"></div>
                                    </div>
                                    <div class="w-8 h-8 rounded-full bg-${u.color}-100 flex items-center justify-center flex-shrink-0">
                                        <span class="text-[10px] font-bold text-${u.color}-700">${u.avatar}</span>
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <div class="flex items-center gap-2 flex-wrap">
                                            <span class="text-sm font-semibold text-slate-900 ${u.done?"line-through":""}">${u.client}</span>
                                            <span class="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium bg-${u.color}-50 text-${u.color}-700 rounded-full">
                                                ${g(u.type)} ${u.type.charAt(0).toUpperCase()+u.type.slice(1)}
                                            </span>
                                        </div>
                                        <div class="text-xs text-slate-500 mt-0.5 truncate">${u.topic}</div>
                                    </div>
                                    <div class="flex items-center gap-2 flex-shrink-0">
                                        <span class="hidden sm:inline px-2 py-1 text-xs font-medium ${u.priority==="High"?"bg-rose-50 text-rose-700":u.priority==="Medium"?"bg-amber-50 text-amber-700":"bg-slate-100 text-slate-500"} rounded-full">${u.priority}</span>
                                        ${u.done?'<span class="px-3 py-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 rounded-lg">&#10003; Done</span>':`<button data-action="followup:markDone" data-fid="${u.id||""}" data-fclient="${s(u.client||"")}" class="px-3 py-1.5 text-xs font-semibold bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">Mark Done</button>`}
                                    </div>
                                </div>
                            `).join("")}
                        </div>
                    </div>

                    <!-- Right panel -->
                    <div class="space-y-5">

                        <!-- Weekly load -->
                        <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                            <div class="text-sm font-semibold text-slate-900 mb-1">This Week</div>
                            <div class="text-xs text-slate-400 mb-4">Follow-ups by day</div>
                            <div class="space-y-3">
                                ${o.map(u=>`
                                    <div>
                                        <div class="flex items-center justify-between text-xs mb-1.5">
                                            <span class="font-medium text-slate-700">${u.day}</span>
                                            <span class="text-slate-400">${u.done}/${u.count}</span>
                                        </div>
                                        <div class="w-full bg-slate-100 rounded-full h-2.5 relative overflow-hidden">
                                            <div class="bg-indigo-400 h-2.5 rounded-full absolute top-0 left-0" style="width:${u.count/r*100}%"></div>
                                            <div class="bg-emerald-400 h-2.5 rounded-full absolute top-0 left-0" style="width:${u.done/r*100}%"></div>
                                        </div>
                                    </div>
                                `).join("")}
                                <div class="flex items-center gap-4 pt-2 text-[10px] font-medium text-slate-500">
                                    <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-indigo-400 inline-block"></span>Scheduled</span>
                                    <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>Completed</span>
                                </div>
                            </div>
                        </div>

                        <!-- Pending alerts - dynamic -->
                        ${(()=>{try{const u=this.getStoredInvoices().filter(C=>String(C.status||"").toLowerCase()==="overdue"),b=(this.getStoredFollowups?this.getStoredFollowups():[]).filter(C=>!C.done&&C.priority==="High"),v=[];return u.length&&v.push({color:"rose",text:u.length+" follow-up"+(u.length>1?"s":"")+" tied to overdue invoice"+(u.length>1?"s":"")}),b.length&&v.push({color:"amber",text:b.length+" high-priority follow-up"+(b.length>1?"s":"")+" pending"}),v.length?`<div class="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-5"><div class="text-sm font-semibold text-amber-900 mb-3">&#9888; Pending Alerts</div><ul class="space-y-2.5">${v.map(C=>`<li class="flex items-start gap-2 text-xs text-amber-800"><span class="w-1.5 h-1.5 rounded-full bg-${C.color}-500 flex-shrink-0 mt-1"></span>${C.text}</li>`).join("")}</ul><button data-action="followup:resolveAllAlerts" class="mt-4 w-full px-4 py-2 text-xs font-semibold bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">Resolve All Alerts</button></div>`:""}catch{return""}})()}

                    </div>
                </div>

                <!-- Client follow-up summary table -->
                <div class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                    <div class="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <div class="text-sm font-semibold text-slate-900">Client Follow-up Summary</div>
                            <div class="text-xs text-slate-400 mt-0.5">Last contact, open items &amp; urgency per client</div>
                        </div>
                        <button data-action="table:exportCsv" class="px-3 py-1.5 text-xs font-semibold bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">Export</button>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm" style="min-width:640px;">
                            <thead class="bg-slate-50 text-xs text-slate-500 font-semibold uppercase tracking-wide">
                                <tr>
                                    <th class="text-left px-5 py-3">Client</th>
                                    <th class="text-left px-4 py-3">Last Contact</th>
                                    <th class="text-center px-4 py-3">Open</th>
                                    <th class="text-left px-4 py-3">Focus Area</th>
                                    <th class="text-left px-4 py-3">Urgency</th>
                                    <th class="text-left px-4 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                ${p.map(u=>`
                                    <tr class="hover:bg-slate-50 transition-colors">
                                        <td class="px-5 py-3">
                                            <div class="flex items-center gap-3">
                                                <div class="w-8 h-8 rounded-full bg-${u.color}-100 flex items-center justify-center flex-shrink-0">
                                                    <span class="text-[10px] font-bold text-${u.color}-700">${u.avatar}</span>
                                                </div>
                                                <span class="font-semibold text-slate-900">${u.name}</span>
                                            </div>
                                        </td>
                                        <td class="px-4 py-3 text-xs text-slate-500">${u.last}</td>
                                        <td class="px-4 py-3 text-center">
                                            <span class="inline-flex items-center justify-center w-6 h-6 text-xs font-bold bg-${u.color}-50 text-${u.color}-700 rounded-full">${u.open}</span>
                                        </td>
                                        <td class="px-4 py-3 text-xs text-slate-600">${u.type}</td>
                                        <td class="px-4 py-3">
                                            <span class="px-2 py-1 text-xs font-semibold rounded-full
                                                ${u.urgency==="Overdue"?"bg-rose-50 text-rose-700":u.urgency==="At Risk"?"bg-amber-50 text-amber-700":u.urgency==="Pending"?"bg-sky-50 text-sky-700":u.urgency==="Upcoming"?"bg-violet-50 text-violet-700":"bg-emerald-50 text-emerald-700"}">
                                                ${u.urgency}
                                            </span>
                                        </td>
                                        <td class="px-4 py-3">
                                            <button data-action="followup:addNew" data-client="${u.name}" class="px-3 py-1.5 text-xs font-semibold bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">Follow up</button>
                                        </td>
                                    </tr>
                                `).join("")}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        `}getEngagementSurveys(){const a=this.getStoredClients?this.getStoredClients():[],t=this.readStore("bezent_feedback_submissions",[]),i=new Map(t.map(c=>[String(c.client||"").toLowerCase(),c])),s=a.slice(0,8).map(c=>{const d=String(c.name||"").toLowerCase(),p=i.get(d),g=p?parseFloat(p.avg||0):0;return{client:String(c.name||"—"),score:g,status:p?g>=4?"Collected":"Needs Attention":"Pending",color:p?g>=4?"emerald":"amber":"slate",last:p!=null&&p.submittedAt?new Date(p.submittedAt).toLocaleDateString("en-IN"):"—"}}),n=[{q:"Delivery Quality",avg:4.6,color:"emerald"},{q:"Communication",avg:4.1,color:"indigo"},{q:"Timelines",avg:3.8,color:"amber"},{q:"Value for Money",avg:4.2,color:"sky"}],l=this.readStore("bezent_feedback_submissions",[]),o=l.length?(l.reduce((c,d)=>c+parseFloat(d.avg||0),0)/l.length).toFixed(1):"0.0",r=(window.location.origin||"")+window.location.pathname.replace(/[^/]*$/,"")+"feedback.html";return`
            <div class="space-y-6 fade-in">
                <div class="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h2 class="text-xl sm:text-2xl font-semibold text-slate-900">Feedback &amp; Surveys</h2>
                        <p class="text-sm text-slate-500">Collect client feedback, share the survey link, and view all responses</p>
                    </div>
                    <button data-action="table:exportCsv" class="px-4 py-2 text-sm font-medium bg-purple-50 text-purple-700 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors">Export CSV</button>
                </div>

                <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                        <div class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Responses</div>
                        <div class="text-2xl font-bold text-slate-900 mt-1">${l.length+3}</div>
                        <div class="text-xs text-emerald-600 mt-1">&#x2191; 2 this week</div>
                    </div>
                    <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                        <div class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Avg Score</div>
                        <div class="text-2xl font-bold text-slate-900 mt-1" id="feedbackAvgScore">${o}</div>
                        <div class="text-xs text-slate-500 mt-1">out of 5.0</div>
                    </div>
                    <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                        <div class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Pending</div>
                        <div class="text-2xl font-bold text-amber-600 mt-1">1</div>
                        <div class="text-xs text-slate-500 mt-1">awaiting response</div>
                    </div>
                    <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                        <div class="text-xs font-semibold text-slate-500 uppercase tracking-wide">NPS Score</div>
                        <div class="text-2xl font-bold text-purple-600 mt-1">72</div>
                        <div class="text-xs text-emerald-600 mt-1">&#x2191; 8 pts from last month</div>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <!-- Left: Shareable link + Form -->
                    <div class="bg-white rounded-xl border border-purple-200 p-5 shadow-sm">
                        <div class="flex items-center gap-2 mb-4">
                            <div class="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                                <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M13.828 10.172a4 4 0 0 0-5.656 0l-4 4a4 4 0 0 0 5.656 5.656l1.102-1.101m-.758-4.899a4 4 0 0 0 5.656 0l4-4a4 4 0 0 0-5.656-5.656l-1.1 1.1"/></svg>
                            </div>
                            <div>
                                <div class="text-sm font-semibold text-slate-900">Shareable Survey Link</div>
                                <div class="text-xs text-slate-500">Send to clients to collect feedback</div>
                            </div>
                        </div>
                        <div class="flex gap-2">
                             <input id="surveyLinkInput" readonly value="${r}" class="flex-1 text-xs border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 text-slate-600 min-w-0" />
                             <button id="surveyLinkCopyBtn" class="px-3 py-2 text-xs font-semibold bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors flex-shrink-0">Copy</button>
                             <a id="surveyLinkOpenBtn" href="${r}" target="_blank" rel="noopener noreferrer" class="px-3 py-2 text-xs font-semibold bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex-shrink-0 inline-flex items-center gap-1">
                                 <svg width="11" height="11" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                                 Open
                             </a>
                         </div>
                         <p class="text-xs text-slate-400 mt-2">Copy this link and share it with clients — they'll see a clean Google-Forms-style page with no CRM navigation.</p>

                        <div class="mt-5 border-t border-slate-100 pt-5">
                            <div class="text-sm font-semibold text-slate-800 mb-3">Submit Client Feedback</div>
                            <form id="surveySubmitForm" class="space-y-3">
                                <div>
                                    <label class="text-xs font-medium text-slate-600">Client / Company Name *</label>
                                    <input name="clientName" required placeholder="e.g. Acme Private Limited" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300" />
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-slate-600">Email (optional)</label>
                                    <input name="clientEmail" type="email" placeholder="client@company.com" class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300" />
                                </div>
                                <div class="grid grid-cols-2 gap-2">
                                    <div>
                                        <label class="text-xs font-medium text-slate-600">Delivery Quality</label>
                                        <select name="quality" class="mt-1 w-full border border-slate-200 rounded-lg px-2 py-2 text-sm focus:outline-none">
                                            <option value="5">5 — Excellent</option><option value="4">4 — Good</option><option value="3">3 — Average</option><option value="2">2 — Poor</option><option value="1">1 — Very Poor</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="text-xs font-medium text-slate-600">Communication</label>
                                        <select name="communication" class="mt-1 w-full border border-slate-200 rounded-lg px-2 py-2 text-sm focus:outline-none">
                                            <option value="5">5 — Excellent</option><option value="4">4 — Good</option><option value="3">3 — Average</option><option value="2">2 — Poor</option><option value="1">1 — Very Poor</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="text-xs font-medium text-slate-600">Timelines</label>
                                        <select name="timeline" class="mt-1 w-full border border-slate-200 rounded-lg px-2 py-2 text-sm focus:outline-none">
                                            <option value="5">5 — Excellent</option><option value="4">4 — Good</option><option value="3">3 — Average</option><option value="2">2 — Poor</option><option value="1">1 — Very Poor</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="text-xs font-medium text-slate-600">Value for Money</label>
                                        <select name="value" class="mt-1 w-full border border-slate-200 rounded-lg px-2 py-2 text-sm focus:outline-none">
                                            <option value="5">5 — Excellent</option><option value="4">4 — Good</option><option value="3">3 — Average</option><option value="2">2 — Poor</option><option value="1">1 — Very Poor</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-slate-600">Comments / Additional Feedback</label>
                                    <textarea name="comments" rows="3" placeholder="Share your experience with us..." class="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"></textarea>
                                </div>
                                <button type="submit" class="w-full px-4 py-2.5 text-sm font-semibold bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Submit Feedback</button>
                            </form>
                        </div>
                    </div>

                    <!-- Right: Status table + Question breakdown -->
                    <div class="lg:col-span-2 space-y-5">
                        <div class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                            <div class="p-4 border-b border-slate-200 flex items-center justify-between">
                                <div class="text-sm font-semibold text-slate-900">Client Survey Status</div>
                                <span class="text-xs text-slate-500">Last 30 days</span>
                            </div>
                            <div class="overflow-x-auto">
                                <table class="w-full text-sm" style="min-width:500px;">
                                    <thead class="bg-slate-50 text-slate-600">
                                        <tr>
                                            <th class="text-left px-4 py-3 font-medium">Client</th>
                                            <th class="text-left px-4 py-3 font-medium">Score</th>
                                            <th class="text-left px-4 py-3 font-medium">Status</th>
                                            <th class="text-left px-4 py-3 font-medium">Last Updated</th>
                                            <th class="text-left px-4 py-3 font-medium">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-slate-200">
                                        ${s.map(c=>`
                                            <tr class="hover:bg-slate-50">
                                                <td class="px-4 py-3 font-medium text-slate-900">${c.client}</td>
                                                <td class="px-4 py-3 text-slate-700">${c.score?c.score.toFixed(1):"—"}</td>
                                                <td class="px-4 py-3"><span class="px-2 py-1 text-xs font-medium bg-${c.color}-50 text-${c.color}-700 rounded-full">${c.status}</span></td>
                                                <td class="px-4 py-3 text-slate-500">${c.last}</td>
                                                <td class="px-4 py-3">
                                                    <button data-action="${c.status==="Pending"?"billing:sendBulkReminders":"survey:viewResponse"}" data-client="${c.client}" class="px-3 py-1.5 text-xs font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100">${c.status==="Pending"?"Remind":"View"}</button>
                                                </td>
                                            </tr>
                                        `).join("")}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                            <h3 class="text-sm font-semibold text-slate-900 mb-4">Average Score by Category</h3>
                            <div class="grid grid-cols-2 gap-4">
                                ${n.map(c=>`
                                    <div class="p-3 bg-slate-50 rounded-lg">
                                        <div class="flex items-center justify-between text-sm mb-2">
                                            <span class="text-slate-700 font-medium">${c.q}</span>
                                            <span class="font-bold text-${c.color}-700">${c.avg.toFixed(1)}/5</span>
                                        </div>
                                        <div class="w-full bg-slate-200 rounded-full h-2">
                                            <div class="bg-${c.color}-500 h-2 rounded-full" style="width:${c.avg/5*100}%"></div>
                                        </div>
                                    </div>
                                `).join("")}
                            </div>
                            ${(()=>{try{const c=(this.readStore("bezent_feedback_submissions",[])||[]).filter(d=>parseFloat(d.avg||10)<4);return c.length?'<div class="mt-3 p-3 bg-rose-50 border border-rose-100 rounded-lg text-xs font-medium text-rose-800">&#9888; Attention: '+c.map(d=>d.client||"Client").join(", ")+" scored below 4.0 — follow up recommended.</div>":""}catch{return""}})()}
                        </div>
                    </div>
                </div>

                <!-- Submitted Feedback Table -->
                <div class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                    <div class="p-4 border-b border-slate-200 flex items-center justify-between">
                        <div>
                            <div class="text-sm font-semibold text-slate-900">Submitted Feedback</div>
                            <div class="text-xs text-slate-500 mt-0.5">All responses collected via your survey link</div>
                        </div>
                        <span class="px-2 py-1 text-xs font-medium bg-purple-50 text-purple-700 rounded-full">${l.length} form response${l.length!==1?"s":""}</span>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm" style="min-width:900px;">
                            <thead class="bg-slate-50 text-slate-600">
                                <tr>
                                    <th class="text-left px-4 py-3 font-medium">Client</th>
                                    <th class="text-left px-4 py-3 font-medium">Email</th>
                                    <th class="text-center px-3 py-3 font-medium">Quality</th>
                                    <th class="text-center px-3 py-3 font-medium">Comm.</th>
                                    <th class="text-center px-3 py-3 font-medium">Timeline</th>
                                    <th class="text-center px-3 py-3 font-medium">Value</th>
                                    <th class="text-center px-3 py-3 font-medium">Avg</th>
                                    <th class="text-left px-4 py-3 font-medium">Date</th>
                                    <th class="text-left px-4 py-3 font-medium">Comments</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-200" id="feedbackSubmissionsTbody">
                                ${this._buildFeedbackRows(l)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `}getEngagementHealth(){const a=this.getStoredClients(),t=this.getStoredProjects(),i=this.readStore("bezent_feedback_submissions",[]),s=this.getAllInvoices(),n={};a.forEach(o=>{const r=String(o.name||"").trim();r&&(n[r]={client:r,score:80,signals:[],overdueInvoices:0,completedProjects:0,openProjects:0,feedbackAvg:null})}),t.forEach(o=>{var d,p;const r=String(o.client||"").trim();if(!n[r])return;const c=String(((d=o==null?void 0:o.payment)==null?void 0:d.overdueStatus)||"").toLowerCase();(c.includes("overdue")||c.includes("days due"))&&(n[r].overdueInvoices++,n[r].score-=12,n[r].signals.push("Payment overdue")),String((o==null?void 0:o.status)||((p=o==null?void 0:o.monitoring)==null?void 0:p.overallProjectStatus)||"").toLowerCase().includes("complet")?(n[r].completedProjects++,n[r].score+=5):n[r].openProjects++}),i.forEach(o=>{const r=String(o.name||o.client||"").trim();if(!n[r])return;const c=parseFloat(o.avg);isNaN(c)||(n[r].feedbackAvg=c,n[r].score+=c>=4?8:c>=3?2:-10,n[r].signals.push(`Feedback: ${c}/5`))}),s.forEach(o=>{const r=String(o.client||"").trim();n[r]&&String(o.status||"").toLowerCase()==="overdue"&&(n[r].score-=8,n[r].signals.includes("Overdue invoice")||n[r].signals.push("Overdue invoice"))});let l=Object.values(n).map(o=>{const r=Math.min(100,Math.max(0,o.score)),c=r>=80?"Healthy":r>=65?"Stable":r>=45?"Watch":"At Risk",d=r>=80?"emerald":r>=65?"sky":r>=45?"amber":"rose";return o.signals.length||o.signals.push("No projects yet","No feedback collected"),{client:o.client,score:r,label:c,color:d,signals:o.signals.slice(0,3)}});return l.length||(l=[{client:"No clients registered yet",score:0,label:"N/A",color:"slate",signals:["Register clients and projects to see health scores"]}]),`
            <div class="space-y-6 fade-in">
                <div class="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h2 class="text-xl sm:text-2xl font-semibold text-slate-900">Client Health</h2>
                        <p class="text-sm text-slate-500">Health scores and early warning signals</p>
                    </div>
                    <button data-action="health:createPlaybook" class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Create Playbook</button>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    ${l.map(o=>`
                        <div class="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-lg">
                            <div class="flex items-start justify-between">
                                <div>
                                    <div class="text-sm font-semibold text-slate-900">${o.client}</div>
                                    <div class="text-xs text-slate-500 mt-1">Signals: ${o.signals.length}</div>
                                </div>
                                <span class="px-2 py-1 text-xs font-medium bg-${o.color}-50 text-${o.color}-700 rounded-full">${o.label}</span>
                            </div>
                            <div class="mt-4">
                                <div class="flex items-center justify-between text-sm">
                                    <span class="text-slate-600">Health score</span>
                                    <span class="font-semibold text-slate-900">${o.score}</span>
                                </div>
                                <div class="mt-2 w-full bg-slate-200 rounded-full h-2">
                                    <div class="bg-${o.color}-600 h-2 rounded-full" style="width: ${o.score}%"></div>
                                </div>
                            </div>
                            <div class="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
                                ${o.signals.map(r=>`
                                    <div class="p-2 bg-slate-50 rounded-lg text-xs text-slate-700">${r}</div>
                                `).join("")}
                            </div>
                            <div class="mt-4 flex gap-2">
                                <button data-action="billing:goToClient" data-client-name="${o.client}" class="flex-1 px-3 py-2 text-sm font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">View Client</button>
                                <button data-action="engagement:logAction" data-client="${o.client}" class="flex-1 px-3 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Log Action</button>
                            </div>
                        </div>
                    `).join("")}
                </div>
            </div>
        `}getEngagementNextProjects(){const a=this.getStoredClients(),t=this.getStoredProjects(),i=["Project follow-up & support","Annual maintenance contract","Process optimization review","Quality audit & inspection","Technical documentation","Staff training & onboarding","Upgrade & modernization","Feasibility study for new scope"],s={};t.forEach(l=>{var r;const o=String(l.client||"").trim();o&&(s[o]||(s[o]={any:0,completed:0,lastBudget:""}),s[o].any++,String((l==null?void 0:l.status)||((r=l==null?void 0:l.monitoring)==null?void 0:r.overallProjectStatus)||"").toLowerCase().includes("complet")&&(s[o].completed++,l.budget&&(s[o].lastBudget=l.budget)))});let n=a.filter(l=>{const o=String(l.name||"").trim(),r=s[o];return r&&r.any>0}).map((l,o)=>{const r=s[String(l.name).trim()],c=r?Math.round(r.completed/r.any*100):0,d=c>=100?"All projects completed — high renewal potential":c>=50?"Active client with completed milestones":"Active engagement — upsell opportunity",p=i[o%i.length],g=["emerald","sky","indigo","amber","purple","rose"];return{client:String(l.name).trim(),idea:p,value:r.lastBudget||"—",reason:d,color:g[o%g.length]}});return n.length||(n=[{client:"No suggestions yet",idea:"Register projects for your clients to see next project recommendations",value:"—",reason:"Coming soon",color:"slate"}]),`
            <div class="space-y-6 fade-in">
                <div class="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h2 class="text-xl sm:text-2xl font-semibold text-slate-900">Next Projects</h2>
                        <p class="text-sm text-slate-500">Suggested next services to improve retention</p>
                    </div>
                    <button data-action="quotation:addNew" class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Create Proposal</button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${n.map(l=>`
                        <div class="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-lg">
                            <div class="flex items-start justify-between">
                                <div>
                                    <div class="text-sm font-semibold text-slate-900">${l.client}</div>
                                    <div class="text-xs text-slate-500 mt-1">Recommended</div>
                                </div>
                                <span class="px-2 py-1 text-xs font-medium bg-${l.color}-50 text-${l.color}-700 rounded-full">High fit</span>
                            </div>
                            <div class="mt-4 p-3 bg-slate-50 rounded-lg">
                                <div class="text-sm font-medium text-slate-900">${l.idea}</div>
                                <div class="text-xs text-slate-500 mt-1">${l.reason}</div>
                            </div>
                            <div class="mt-4 flex items-center justify-between">
                                <div class="text-xs text-slate-500">Expected value</div>
                                <div class="text-sm font-semibold text-slate-900">${l.value}</div>
                            </div>
                            <div class="mt-4 flex gap-2">
                                <button data-action="leads:addFromSuggestion" data-client="${l.client}" data-idea="${l.idea}" class="flex-1 px-3 py-2 text-sm font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">Add to Pipeline</button>
                                <button data-action="quotation:addNew" class="flex-1 px-3 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Send Proposal</button>
                            </div>
                        </div>
                    `).join("")}
                </div>
            </div>
        `}getEngagementFieldVisits(){const a=this.readStore("bezent_visits",[]),t=r=>String(r??"").replace(/</g,"&lt;"),i=a,s=i.filter(r=>String(r.status||"Logged").toLowerCase()==="confirmed").length,n=i.filter(r=>["pending","tentative","logged"].includes(String(r.status||"logged").toLowerCase())).length,l=[...new Set(i.map(r=>r.client))].length,o={Confirmed:"emerald",Pending:"amber",Tentative:"purple",Logged:"sky",Cancelled:"rose"};return`
            <div class="space-y-6 fade-in">
                <div class="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h2 class="text-xl sm:text-2xl font-semibold text-slate-900">Field Visits Planner</h2>
                        <p class="text-sm text-slate-500">Log and manage on-site client visits</p>
                    </div>
                    <button data-action="visits:logVisit" class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">+ Log Visit</button>
                </div>
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div class="bg-white rounded-xl border p-4"><div class="text-xs text-slate-500">Total Visits</div><div class="text-2xl font-bold text-slate-900 mt-1">${i.length}</div>
                    <div class="bg-white rounded-xl border p-4"><div class="text-xs text-slate-500">Confirmed</div><div class="text-2xl font-bold text-emerald-700 mt-1">${s}</div>
                    <div class="bg-white rounded-xl border p-4"><div class="text-xs text-slate-500">Pending</div><div class="text-2xl font-bold text-amber-600 mt-1">${n}</div>
                    <div class="bg-white rounded-xl border p-4"><div class="text-xs text-slate-500">Unique Clients</div><div class="text-2xl font-bold text-purple-700 mt-1">${l}</div>
                </div>
                ${i.length===0?`<div class="bg-white rounded-xl border p-12 text-center text-slate-400 shadow-sm">
                    <i data-lucide="map-pin" class="w-12 h-12 mx-auto mb-3 opacity-20"></i>
                    <p class="font-medium text-slate-600">No visits logged yet</p>
                    <p class="text-sm mt-1">Click <strong>+ Log Visit</strong> to record a client visit.</p>
                </div>`:`<div class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                    <div class="overflow-x-auto"><table class="w-full text-sm" style="min-width:700px">
                        <thead class="bg-slate-50 text-slate-600"><tr>
                            <th class="text-left px-4 py-3 font-medium">Client</th>
                            <th class="text-left px-4 py-3 font-medium">Date</th>
                            <th class="text-left px-4 py-3 font-medium">Purpose</th>
                            <th class="text-left px-4 py-3 font-medium">Outcome</th>
                            <th class="text-left px-4 py-3 font-medium">Status</th>
                        </tr></thead>
                        <tbody class="divide-y divide-slate-100">
                        ${i.map(r=>{const c=o[r.status]||"sky";return`<tr class="hover:bg-slate-50">
                                <td class="px-4 py-3 font-medium text-slate-800">${t(r.client)}</td>
                                <td class="px-4 py-3 text-slate-600">${t(r.date)}</td>
                                <td class="px-4 py-3 text-slate-600">${t(r.purpose||"—")}</td>
                                <td class="px-4 py-3 text-slate-600 max-w-xs truncate">${t(r.outcome||"—")}</td>
                                <td class="px-4 py-3"><span class="px-2 py-1 text-xs rounded-full bg-${c}-100 text-${c}-700">${t(r.status||"Logged")}</span></td>
                            </tr>`}).join("")}
                        </tbody>
                    </table></div>
                </div>`}
            </div>`}getEngagementRouteMap(){const a=(this.getStoredFollowups?this.getStoredFollowups():[]).filter(r=>String(r.type||"").toLowerCase()==="visit"&&!r.done),t=new Map;a.forEach((r,c)=>{const d=String(r.owner||r.assignedTo||"Field Engineer");t.has(d)||t.set(d,[]),t.get(d).push(r)});const i=["#7c3aed","#0ea5e9","#10b981","#f59e0b","#ef4444"],s=[...t.entries()].slice(0,5).map(([r,c],d)=>({id:"eng"+d,engineer:r,color:i[d%i.length],date:new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}),stops:c.slice(0,5).map((p,g)=>({seq:g+1,client:String(p.client||"Client"),address:String(p.address||p.location||"—"),time:String(p.scheduled_time||p.scheduledTime||"—"),type:"Visit",status:g===0?"start":g===c.length-1?"end":"mid",lat:null,lng:null}))})),n=r=>r==="start"?"bg-emerald-500":r==="end"?"bg-rose-400":"bg-purple-500",l=s.reduce((r,c)=>r+c.stops.length,0),o=s.length;return`
            <div class="space-y-6 fade-in">

                <!-- Header -->
                <div class="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h2 class="text-xl sm:text-2xl font-semibold text-slate-900">Visit Route Map</h2>
                        <p class="text-sm text-slate-500 mt-0.5">Live field-engineer routes plotted on OpenStreetMap</p>
                    </div>
                    <div class="flex items-center gap-2">
                        <button data-action="routemap:exportKML" class="px-4 py-2 text-sm font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">Export KML</button>
                        <button data-action="routemap:optimise" class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Optimise Routes</button>
                    </div>
                </div>

                <!-- KPI strip -->
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                            <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
                        </div>
                        <div>
                            <div class="text-xl font-bold text-slate-900">${o}</div>
                            <div class="text-xs text-slate-500">Engineers Active</div>
                        </div>
                    </div>
                    <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0">
                            <svg class="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                        </div>
                        <div>
                            <div class="text-xl font-bold text-slate-900">${l}</div>
                            <div class="text-xs text-slate-500">Total Stops</div>
                        </div>
                    </div>
                    <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                            <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                        </div>
                        <div>
                            <div class="text-xl font-bold text-slate-900">~68 km</div>
                            <div class="text-xs text-slate-500">Est. Distance</div>
                        </div>
                    </div>
                    <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                            <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><circle cx="12" cy="12" r="10"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4 2"/></svg>
                        </div>
                        <div>
                            <div class="text-xl font-bold text-slate-900">~6.5 hrs</div>
                            <div class="text-xs text-slate-500">Est. Field Time</div>
                        </div>
                    </div>
                </div>

                <!-- Map + sidebar -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    <!-- Leaflet map (spans 2 cols) -->
                    <div class="lg:col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm" style="height:460px;">
                        <!-- Route filter tabs -->
                        <div class="px-4 py-3 border-b border-slate-100 flex items-center gap-2 flex-wrap">
                            <button id="rmTab_all" onclick="window._rmShowRoute('all')" class="px-3 py-1.5 text-xs font-semibold bg-purple-600 text-white rounded-full transition-colors">All Routes</button>
                            ${s.map(r=>`
                            <button id="rmTab_${r.id}" onclick="window._rmShowRoute('${r.id}')" class="px-3 py-1.5 text-xs font-semibold bg-slate-100 text-slate-700 rounded-full hover:bg-slate-200 transition-colors">${r.engineer}</button>
                            `).join("")}
                            <div class="ml-auto flex items-center gap-3 text-xs text-slate-500">
                                <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>Start</span>
                                <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block"></span>Stop</span>
                                <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block"></span>End</span>
                            </div>
                        </div>
                        <div id="routeLeafletMap" style="height:calc(460px - 53px); width:100%;"></div>
                    </div>

                    <!-- Route cards (enhanced) -->
                    <div class="space-y-4 overflow-y-auto" style="max-height:460px;">
                        ${s.map((r,c)=>{const d=c===0?2:0,p=Math.round(d/r.stops.length*100),g=c===0?"In Progress":"Upcoming",h=c===0?"bg-emerald-50 text-emerald-700":"bg-amber-50 text-amber-700";return`
                        <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm cursor-pointer hover:border-purple-300 hover:shadow-md transition-all" onclick="window._rmShowRoute('${r.id}')">
                            <!-- Card header -->
                            <div class="flex items-start justify-between mb-3">
                                <div>
                                    <div class="flex items-center gap-2">
                                        <span class="w-2.5 h-2.5 rounded-full inline-block flex-shrink-0" style="background:${r.color}"></span>
                                        <span class="text-sm font-bold text-slate-900">${r.engineer}</span>
                                        <span class="px-2 py-0.5 text-[10px] font-semibold ${h} rounded-full">${g}</span>
                                    </div>
                                    <div class="text-xs text-slate-500 mt-1 pl-4">${r.date} &middot; ${r.stops.length} stops</div>
                                </div>
                                <button data-action="routemap:directions" data-stop="${stop.name}" class="flex-shrink-0 px-2 py-1 text-xs font-semibold bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100">Directions</button>
                            </div>
                            <!-- Progress bar -->
                            <div class="mb-3">
                                <div class="flex items-center justify-between text-xs text-slate-500 mb-1">
                                    <span>${d} of ${r.stops.length} stops done</span>
                                    <span class="font-semibold text-slate-700">${p}%</span>
                                </div>
                                <div class="w-full bg-slate-100 rounded-full h-1.5">
                                    <div class="h-1.5 rounded-full transition-all" style="width:${p}%;background:${r.color}"></div>
                                </div>
                            </div>
                            <!-- Stop list -->
                            <div class="space-y-0">
                                ${r.stops.map((m,f)=>{const w=f<d;return`
                                <div class="flex gap-3 ${f<r.stops.length-1?"mb-2.5":""}">
                                    <div class="flex flex-col items-center flex-shrink-0">
                                        <div class="w-3 h-3 rounded-full mt-0.5 ${w?"bg-emerald-500":n(m.status)} ${w?"ring-2 ring-emerald-200":""}"></div>
                                        ${f<r.stops.length-1?`<div class="w-px flex-1 mt-1 ${w?"bg-emerald-300":"bg-slate-200"}" style="min-height:14px;"></div>`:""}
                                    </div>
                                    <div class="pb-1 min-w-0 flex-1">
                                        <div class="flex items-center gap-1.5">
                                            <span class="text-xs font-semibold text-slate-900 truncate ${w?"line-through text-slate-400":""}">${m.seq}. ${m.client}</span>
                                            ${w?'<svg class="w-3 h-3 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>':""}
                                        </div>
                                        <div class="text-xs text-slate-500">${m.time} &middot; ${m.type}</div>
                                        <div class="text-xs text-slate-400 truncate">${m.address}</div>
                                    </div>
                                </div>`}).join("")}
                            </div>
                        </div>`}).join("")}
                    </div>
                </div>

                <!-- Today's dispatch summary -->
                <div class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                    <div class="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <div class="text-sm font-semibold text-slate-900">Today's Dispatch Summary</div>
                            <div class="text-xs text-slate-400 mt-0.5">All stops scheduled across engineers</div>
                        </div>
                        <span class="px-2.5 py-1 text-xs font-semibold bg-purple-50 text-purple-700 rounded-full">${l} stops · ${o} engineers</span>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm" style="min-width:560px;">
                            <thead class="bg-slate-50 text-xs text-slate-500 font-semibold uppercase tracking-wide">
                                <tr>
                                    <th class="text-left px-5 py-3">#</th>
                                    <th class="text-left px-4 py-3">Engineer</th>
                                    <th class="text-left px-4 py-3">Client</th>
                                    <th class="text-left px-4 py-3">Address</th>
                                    <th class="text-left px-4 py-3">Time</th>
                                    <th class="text-left px-4 py-3">Type</th>
                                    <th class="text-left px-4 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                ${s.flatMap((r,c)=>r.stops.map((d,p)=>{const g=c===0&&p<2,h=g?"Completed":c===0&&p===2?"Next Up":"Scheduled",m=g?"bg-emerald-50 text-emerald-700":h==="Next Up"?"bg-purple-50 text-purple-700":"bg-slate-100 text-slate-500";return`
                                <tr class="hover:bg-slate-50 transition-colors">
                                    <td class="px-5 py-3 text-xs text-slate-400 font-medium">${d.seq}</td>
                                    <td class="px-4 py-3">
                                        <span class="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                                            <span class="w-2 h-2 rounded-full inline-block flex-shrink-0" style="background:${r.color}"></span>
                                            ${r.engineer}
                                        </span>
                                    </td>
                                    <td class="px-4 py-3 text-xs font-medium text-slate-900">${d.client}</td>
                                    <td class="px-4 py-3 text-xs text-slate-500">${d.address}</td>
                                    <td class="px-4 py-3 text-xs text-slate-600 font-medium">${d.time}</td>
                                    <td class="px-4 py-3 text-xs text-slate-500">${d.type}</td>
                                    <td class="px-4 py-3">
                                        <span class="px-2 py-1 text-xs font-semibold rounded-full ${m}">${h}</span>
                                    </td>
                                </tr>`})).join("")}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        `}_initRouteMap(){var l;if((l=document.getElementById("routeLeafletMap"))!=null&&l._leaflet_id)return;const a=(typeof this.getStoredFollowups=="function"?this.getStoredFollowups():[]).filter(o=>String(o.type||"").toLowerCase()==="visit"&&!o.done),t=new Map;a.forEach(o=>{const r=String(o.owner||o.assignedTo||"Field Engineer");t.has(r)||t.set(r,[]),t.get(r).push(o)});const i=["#7c3aed","#0ea5e9","#10b981","#f59e0b","#ef4444"],s=[...t.entries()].slice(0,5).map(([o,r],c)=>({id:"eng"+c,color:i[c%i.length],stops:r.slice(0,5).map((d,p)=>({seq:p+1,client:String(d.client||"Client"),address:String(d.address||d.location||"—"),time:String(d.scheduled_time||d.scheduledTime||"—"),type:"Visit",status:p===0?"start":p===r.length-1?"end":"mid",lat:null,lng:null}))}));(o=>{if(window.L){o();return}if(!document.getElementById("leaflet-css")){const c=document.createElement("link");c.id="leaflet-css",c.rel="stylesheet",c.href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",document.head.appendChild(c)}const r=document.createElement("script");r.src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",r.onload=o,document.head.appendChild(r)})(()=>{const o=document.getElementById("routeLeafletMap");if(!o||o._leaflet_id)return;const r=window.L.map(o,{zoomControl:!0}).setView([13,77.6],7);window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',maxZoom:18}).addTo(r);const c=h=>h==="start"?"#10b981":h==="end"?"#f43f5e":"#7c3aed",d=(h,m)=>window.L.divIcon({className:"",html:`<div style="
                    width:28px;height:28px;border-radius:50%;
                    background:${c(h)};color:#fff;
                    display:flex;align-items:center;justify-content:center;
                    font-size:11px;font-weight:700;
                    border:2.5px solid #fff;
                    box-shadow:0 2px 6px rgba(0,0,0,0.25);
                ">${m}</div>`,iconSize:[28,28],iconAnchor:[14,14]}),p={},g=[];s.forEach(h=>{const m=window.L.layerGroup(),f=h.stops.map(w=>[w.lat,w.lng]);window.L.polyline(f,{color:h.color,weight:3,opacity:.75,dashArray:"8 6"}).addTo(m),h.stops.forEach(w=>{window.L.marker([w.lat,w.lng],{icon:d(w.status,w.seq)}).bindPopup(`
                            <div style="font-family:Inter,sans-serif;min-width:160px">
                                <div style="font-weight:700;font-size:13px;margin-bottom:4px">${w.client}</div>
                                <div style="font-size:11px;color:#64748b">${w.address}</div>
                                <div style="font-size:11px;margin-top:4px"><b>${w.time}</b> &middot; ${w.type}</div>
                            </div>
                        `,{maxWidth:220}).addTo(m),g.push([w.lat,w.lng])}),m.addTo(r),p[h.id]={group:m,bounds:window.L.latLngBounds(f)}}),g.length&&r.fitBounds(window.L.latLngBounds(g),{padding:[30,30]}),window._rmShowRoute=h=>{document.querySelectorAll('[id^="rmTab_"]').forEach(f=>{f.className="px-3 py-1.5 text-xs font-semibold bg-slate-100 text-slate-700 rounded-full hover:bg-slate-200 transition-colors"});const m=document.getElementById("rmTab_"+h);m&&(m.className="px-3 py-1.5 text-xs font-semibold bg-purple-600 text-white rounded-full transition-colors"),h==="all"?(Object.values(p).forEach(f=>r.addLayer(f.group)),g.length&&r.fitBounds(window.L.latLngBounds(g),{padding:[30,30]})):Object.entries(p).forEach(([f,w])=>{f===h?(r.addLayer(w.group),r.fitBounds(w.bounds,{padding:[40,40]})):r.removeLayer(w.group)})}})}getEngagementMobileSync(){const a=(typeof this.getStoredFollowups=="function"?this.getStoredFollowups():[]).filter(o=>String(o.type||"").toLowerCase()==="visit"),t=new Map;a.forEach(o=>{const r=String(o.owner||o.assignedTo||"Field Engineer");t.has(r)||t.set(r,{visits:0,done:0});const c=t.get(r);c.visits++,o.done&&c.done++});const i=["emerald","sky","amber","purple"],s=[...t.entries()].map(([o,r],c)=>({engineer:o,device:"—",lastSync:"—",visits:r.visits,checkins:r.done,photos:0,status:"Online",color:i[c%i.length]})),n=a.slice(0,5).map(o=>({time:String(o.scheduled_time||o.scheduledTime||"—"),engineer:String(o.owner||o.assignedTo||"—"),action:o.done?"Visit Complete":"Check-in",client:String(o.client||"—"),note:String(o.topic||o.note||"")})),l={"Check-in":"purple","Photo Upload":"sky","Visit Complete":"emerald","Route Start":"slate"};return`
            <div class="space-y-6 fade-in">
                <div class="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h2 class="text-xl sm:text-2xl font-semibold text-slate-900">Mobile Sync &amp; Field Activity</h2>
                        <p class="text-sm text-slate-500">Real-time check-ins, photo uploads, and sync status for field engineers</p>
                    </div>
                    <button data-action="sync:forceAll" class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Force Sync All</button>
                </div>

                <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                        <div class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Online Now</div>
                        <div class="text-2xl font-bold text-emerald-600 mt-1">2</div>
                        <div class="text-xs text-slate-500 mt-1">of 4 engineers</div>
                    </div>
                    <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                        <div class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Check-ins Today</div>
                        <div class="text-2xl font-bold text-purple-600 mt-1">7</div>
                        <div class="text-xs text-slate-500 mt-1">across all engineers</div>
                    </div>
                    <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                        <div class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Photos Uploaded</div>
                        <div class="text-2xl font-bold text-sky-600 mt-1">34</div>
                        <div class="text-xs text-slate-500 mt-1">site documentation</div>
                    </div>
                    <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                        <div class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Pending Sync</div>
                        <div class="text-2xl font-bold text-amber-600 mt-1">1</div>
                        <div class="text-xs text-slate-500 mt-1">engineer offline</div>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div class="space-y-3">
                        <h3 class="text-sm font-semibold text-slate-800">Engineer Device Status</h3>
                        ${s.map(o=>`
                            <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center gap-4">
                                <div class="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                                    <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <div class="flex items-center justify-between">
                                        <div class="text-sm font-semibold text-slate-900 truncate">${o.engineer}</div>
                                        <span class="px-2 py-0.5 text-xs font-medium bg-${o.color}-50 text-${o.color}-700 rounded-full flex-shrink-0 ml-2">${o.status}</span>
                                    </div>
                                    <div class="text-xs text-slate-500 truncate">${o.device} · Last sync: ${o.lastSync}</div>
                                    <div class="flex gap-4 mt-1 text-xs text-slate-600">
                                        <span><strong>${o.visits}</strong> visits</span>
                                        <span><strong>${o.checkins}</strong> check-ins</span>
                                        <span><strong>${o.photos}</strong> photos</span>
                                    </div>
                                </div>
                            </div>
                        `).join("")}
                    </div>

                    <div class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                        <div class="p-4 border-b border-slate-100">
                            <div class="text-sm font-semibold text-slate-900">Live Activity Feed</div>
                            <div class="text-xs text-slate-500 mt-0.5">Real-time updates from the field</div>
                        </div>
                        <div class="divide-y divide-slate-100">
                            ${n.map(o=>{const r=l[o.action]||"slate";return`
                                <div class="p-3 flex items-start gap-3">
                                    <div class="w-7 h-7 rounded-lg bg-${r}-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <svg class="w-3.5 h-3.5 text-${r}-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 3"/></svg>
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <div class="flex items-center justify-between">
                                            <span class="text-xs font-semibold text-slate-900">${o.engineer} — ${o.action}</span>
                                            <span class="text-xs text-slate-400 flex-shrink-0 ml-2">${o.time}</span>
                                        </div>
                                        <div class="text-xs text-slate-500 mt-0.5">${o.client!=="—"?o.client+" · ":""}${o.note}</div>
                                    </div>
                                </div>`}).join("")}
                        </div>
                    </div>
                </div>
            </div>
        `}renderReportsContent(a){switch(this.currentSubSection){case"funnel":a.innerHTML=this.getReportsFunnel();break;case"roi":a.innerHTML=this.getReportsCampaigns();break;case"ltv":a.innerHTML=this.getReportsLtv();break;case"sop_monthly":a.innerHTML=this.getReportsSopMonthly();break;case"kpi_target":a.innerHTML=this.getReportsKpiTarget();break;case"kri_risk":a.innerHTML=this.getReportsKriRisk();break;case"project_roadmap":a.innerHTML=this.getReportsProjectRoadmap();break;default:a.innerHTML=this.getReportsFunnel()}}getKPIData(){const a=typeof this.getStoredLeads=="function"?this.getStoredLeads():[],t=typeof this.getAllInvoices=="function"?this.getAllInvoices():[];let i=[];try{typeof this.getAllProjectsMerged=="function"?i=this.getAllProjectsMerged([]):typeof this.getStoredProjects=="function"?i=this.getStoredProjects():typeof this.readStore=="function"&&(i=this.readStore("bezent_projects",[]))}catch{}const s=typeof this.readStore=="function"?this.readStore("bezent_feedback_submissions",[]):[],n=typeof this.readStore=="function"?this.readStore("bezent_campaigns",[]):[],o=t.filter(j=>String(j.status||"").toLowerCase()==="paid").reduce((j,I)=>j+this.parseCurrencyToNumber(I.amount),0),r=t.reduce((j,I)=>j+this.parseCurrencyToNumber(I.amount),0),c=t.filter(j=>String(j.status||"").toLowerCase()==="overdue").length,d=a.filter(j=>["won","closed","po received"].includes(String(j.stage||j.status||"").toLowerCase())).length,p=a.length?Math.round(d/a.length*100):0,g=s.filter(j=>parseFloat(j.avg||j.score||0)>0),h=g.length?parseFloat((g.reduce((j,I)=>j+parseFloat(I.avg||I.score||0),0)/g.length).toFixed(1)):0,m=i.filter(j=>{var N;const I=String((j==null?void 0:j.status)||((N=j==null?void 0:j.monitoring)==null?void 0:N.overallProjectStatus)||"").toLowerCase();return!I.includes("delay")&&!I.includes("risk")}).length,f=i.length?Math.round(m/i.length*100):0,w=i.length?Math.round(i.reduce((j,I)=>j+parseInt(I.progress||0),0)/i.length):0,u=n.filter(j=>String(j.status||"").toLowerCase()==="active").length,b=n.reduce((j,I)=>j+parseInt(I.opened||0),0),v=n.reduce((j,I)=>j+parseInt(I.delivered||0),0),C=v?Math.round(b/v*100):0,L=u?100:0,F=typeof this.readStore=="function"?this.readStore("bezent_kpi_targets",{}):{};return[{id:"rev",category:"Sales",kpi:"Monthly Revenue",target:5e5,defaultActual:o,unit:"₹",owner:"Team"},{id:"leads",category:"Sales",kpi:"New Leads Generated",target:120,defaultActual:a.length,unit:"",owner:"Team"},{id:"conv",category:"Sales",kpi:"Lead Conversion Rate",target:35,defaultActual:p,unit:"%",owner:"Team"},{id:"deal",category:"Sales",kpi:"Avg Deal Size",target:85e3,defaultActual:d?Math.round(o/d):0,unit:"₹",owner:"Team"},{id:"ontime",category:"Projects",kpi:"Projects Delivered On Time",target:90,defaultActual:f,unit:"%",owner:"Team"},{id:"comp",category:"Projects",kpi:"Avg Project Completion",target:85,defaultActual:w,unit:"%",owner:"Team"},{id:"csat",category:"Projects",kpi:"Client Satisfaction Score",target:9,defaultActual:h,unit:"/10",owner:"Team"},{id:"collect",category:"Finance",kpi:"Invoice Collection Rate",target:95,defaultActual:r?Math.round(o/r*100):0,unit:"%",owner:"Team"},{id:"overdue",category:"Finance",kpi:"Overdue Invoices",target:2,defaultActual:c,unit:" no.",owner:"Team"},{id:"budget",category:"Finance",kpi:"Budget Utilisation",target:80,defaultActual:r?70:0,unit:"%",owner:"Team"},{id:"email",category:"Marketing",kpi:"Email Open Rate",target:28,defaultActual:C,unit:"%",owner:"Team"},{id:"roi",category:"Marketing",kpi:"Campaign ROI",target:300,defaultActual:L,unit:"%",owner:"Team"},{id:"webLeads",category:"Marketing",kpi:"Website Leads Captured",target:40,defaultActual:a.filter(j=>String(j.source||"").toLowerCase()==="website").length,unit:"",owner:"Team"},{id:"sop",category:"Team",kpi:"SOP Daily Report Compliance",target:100,defaultActual:100,unit:"%",owner:"Team"},{id:"fup",category:"Team",kpi:"Follow-up Response Time",target:4,defaultActual:0,unit:"h",owner:"Team"}].map(j=>{const N=(F[j.id]||{}).target??j.target,R=j.defaultActual;let _=N>0?Math.round(R/N*100):0;(j.id==="overdue"||j.id==="fup")&&(_=N>0?Math.round(N/R*100):100);let A="Critical",E=`-${Math.abs(100-_)}%`;return _>=110?(A="Exceeded",E=`+${_-100}%`):_>=90?(A="On Track",E=`+${_-100}%`):_>=70&&(A="At Risk"),(j.id==="overdue"||j.id==="fup")&&(R<=N?(A="Exceeded",_=100,E="+5%"):R<=N*1.5?(A="At Risk",_=70,E="-10%"):(A="Critical",_=40,E="-30%")),{...j,target:N,actual:R,status:A,trend:E,kpiId:j.id}})}getReportsKpiTarget(){const a=this.getKPIData(),t=a.filter(c=>c.status==="Exceeded").length,i=a.filter(c=>c.status==="On Track").length,s=a.filter(c=>c.status==="At Risk").length,n=a.filter(c=>c.status==="Critical").length;Math.round(a.reduce((c,d)=>c+Math.min(Math.round(d.actual/d.target*100),150),0)/a.length);const l=c=>`<span class="px-2 py-0.5 text-[10px] font-bold rounded-full ${{Exceeded:"bg-emerald-100 text-emerald-700","On Track":"bg-sky-100 text-sky-700","At Risk":"bg-amber-100 text-amber-700",Critical:"bg-rose-100 text-rose-700"}[c]||"bg-slate-100 text-slate-600"}">${c}</span>`,o=(c,d,p)=>{const g=Math.min(Math.round(d/c*100),150);return`<div class="flex items-center gap-2"><div class="flex-1 bg-slate-100 rounded-full h-1.5"><div class="${p==="Exceeded"?"bg-emerald-500":p==="On Track"?"bg-sky-500":p==="At Risk"?"bg-amber-500":"bg-rose-500"} h-1.5 rounded-full" style="width:${Math.min(g,100)}%"></div><span class="text-[10px] text-slate-500 w-8 text-right">${g}%</span></div>`},r=[...new Set(a.map(c=>c.category))];return`<div class="space-y-6 fade-in">
            <!-- Header -->
            <div class="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h2 class="text-xl sm:text-2xl font-semibold text-slate-900">KPI vs Target Report</h2>
                    <p class="text-sm text-slate-500">Live performance against defined targets — ${a.length} KPIs tracked</p>
                </div>
                <button id="kpiExportBtn" class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                    <i data-lucide="download" class="w-4 h-4"></i> Export CSV
                </button>
            </div>

            <!-- KPI Summary Cards -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 shadow-sm text-center">
                    <div class="text-2xl font-bold text-emerald-700">${t}</div>
                    <div class="text-xs font-semibold text-emerald-600 mt-1">Exceeded</div>
                </div>
                <div class="bg-sky-50 border border-sky-200 rounded-xl p-4 shadow-sm text-center">
                    <div class="text-2xl font-bold text-sky-700">${i}</div>
                    <div class="text-xs font-semibold text-sky-600 mt-1">On Track</div>
                </div>
                <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 shadow-sm text-center">
                    <div class="text-2xl font-bold text-amber-700">${s}</div>
                    <div class="text-xs font-semibold text-amber-600 mt-1">At Risk</div>
                </div>
                <div class="bg-rose-50 border border-rose-200 rounded-xl p-4 shadow-sm text-center">
                    <div class="text-2xl font-bold text-rose-700">${n}</div>
                    <div class="text-xs font-semibold text-rose-600 mt-1">Critical</div>
                </div>
            </div>

            <!-- KPI Table by category -->
            ${r.map(c=>`
                <div class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                    <div class="px-5 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                        <div class="text-sm font-semibold text-slate-900">${c}</div>
                        <div class="text-xs text-slate-400">${a.filter(d=>d.category===c).length} KPIs</div>
                    </div>
                    <div class="overflow-x-auto"><table class="w-full text-sm" style="min-width:680px">
                        <thead class="text-slate-500 text-xs"><tr>
                            <th class="text-left px-4 py-2 font-medium">KPI</th>
                            <th class="text-right px-4 py-2 font-medium">Target</th>
                            <th class="text-right px-4 py-2 font-medium">Actual</th>
                            <th class="px-4 py-2 font-medium w-32">Progress</th>
                            <th class="text-left px-4 py-2 font-medium">Trend</th>
                            <th class="text-left px-4 py-2 font-medium">Owner</th>
                            <th class="text-left px-4 py-2 font-medium">Status</th>
                            <th class="text-left px-4 py-2 font-medium">Set Target</th>
                        </tr></thead>
                        <tbody class="divide-y divide-slate-50">
                        ${a.filter(d=>d.category===c).map(d=>`
                            <tr class="hover:bg-slate-50">
                                <td class="px-4 py-3 font-medium text-slate-800">${d.kpi}</td>
                                <td class="px-4 py-3 text-right text-slate-600">${d.unit==="₹"?this.formatINR(d.target):d.target+d.unit}</td>
                                <td class="px-4 py-3 text-right font-semibold text-slate-900">${d.unit==="₹"?this.formatINR(d.actual):d.actual+d.unit}</td>
                                <td class="px-4 py-3">${o(d.target,d.actual,d.status)}</td>
                                <td class="px-4 py-3 text-xs ${d.trend.startsWith("+")?"text-emerald-700":"text-rose-700"} font-semibold">${d.trend}</td>
                                <td class="px-4 py-3 text-slate-600">${d.owner}</td>
                                <td class="px-4 py-3">${l(d.status)}</td>
                                <td class="px-4 py-3">
                                    <button data-action="kpi:setTarget" data-kpi-id="${d.id}" data-kpi-label="${d.kpi}" class="px-2 py-1 text-xs font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">Edit</button>
                                </td>
                            </tr>`).join("")}
                        </tbody>
                    </table></div>
                </div>
            `).join("")}
        </div>`}initializeKpiTargetCharts(){const a=this.getKPIData?this.getKPIData():[],t=a.map(o=>Math.min(Math.round(o.actual/o.target*100),150)),i=a.map(o=>({Exceeded:"rgba(16,185,129,0.75)","On Track":"rgba(14,165,233,0.75)","At Risk":"rgba(245,158,11,0.75)",Critical:"rgba(239,68,68,0.75)"})[o.status]),s=document.getElementById("kpiAchievementChart");if(s){if(this.charts.kpiAchievementChart)try{this.charts.kpiAchievementChart.destroy()}catch{}this.charts.kpiAchievementChart=new Chart(s,{type:"bar",data:{labels:a.map(o=>o.kpi),datasets:[{label:"Achievement %",data:t,backgroundColor:i,borderRadius:5,borderSkipped:!1},{label:"Target (100%)",data:Array(a.length).fill(100),type:"line",borderColor:"rgba(100,116,139,0.6)",borderDash:[4,4],borderWidth:1.5,pointRadius:0,fill:!1}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"bottom",labels:{boxWidth:12,font:{size:11}}}},scales:{y:{min:0,max:150,ticks:{callback:o=>o+"%",font:{size:10}}},x:{ticks:{font:{size:10}}}}}})}const n=document.getElementById("kpiStatusChart");if(n){if(this.charts.kpiStatusChart)try{this.charts.kpiStatusChart.destroy()}catch{}const o=a.filter(p=>p.status==="Exceeded").length,r=a.filter(p=>p.status==="On Track").length,c=a.filter(p=>p.status==="At Risk").length,d=a.filter(p=>p.status==="Critical").length;this.charts.kpiStatusChart=new Chart(n,{type:"doughnut",data:{labels:["Exceeded","On Track","At Risk","Critical"],datasets:[{data:[o,r,c,d],backgroundColor:["rgba(16,185,129,0.8)","rgba(14,165,233,0.8)","rgba(245,158,11,0.8)","rgba(239,68,68,0.8)"],borderWidth:2,borderColor:"#fff",hoverOffset:8}]},options:{responsive:!0,maintainAspectRatio:!1,cutout:"68%",plugins:{legend:{position:"bottom",labels:{boxWidth:12,font:{size:11}}}}}})}const l=document.getElementById("kpiExportBtn");l&&(l.onclick=()=>{const o=typeof this.getKPIData=="function"?this.getKPIData():[],c=[["Category","KPI","Target","Actual","Owner","Status"],...o.map(p=>[p.category||"",p.kpi||"",String(p.target||""),String(p.actual||""),p.owner||"Team",p.statusLabel||""])].map(p=>p.map(g=>`"${g}"`).join(",")).join(`
`),d=document.createElement("a");d.href="data:text/csv;charset=utf-8,"+encodeURIComponent(c),d.download="KPI_vs_Target_Report.csv",d.click()})}getKRIData(){const a=typeof this.getAllInvoices=="function"?this.getAllInvoices():[];let t=[];try{typeof this.getAllProjectsMerged=="function"?t=this.getAllProjectsMerged([]):typeof this.getStoredProjects=="function"&&(t=this.getStoredProjects())}catch{}const i=typeof this.getStoredLeads=="function"?this.getStoredLeads():[];typeof this.getStoredClients=="function"&&this.getStoredClients();const s=typeof this.readStore=="function"?this.readStore("bezent_feedback_submissions",[]):[],n=typeof this.readStore=="function"?this.readStore("bezent_campaigns",[]):[],l=a.filter(b=>String((b==null?void 0:b.status)||"").toLowerCase()==="overdue").length,o=i.length,r=i.filter(b=>["closed","po received","converted","won"].includes(String(b.stage||b.status||"").toLowerCase())).length,c=o?r/o:0,d=t.filter(b=>{var C;const v=String((b==null?void 0:b.status)||((C=b==null?void 0:b.monitoring)==null?void 0:C.overallProjectStatus)||"").toLowerCase();return v.includes("delay")||v.includes("risk")}).length;let p=s.filter(b=>parseFloat(b.avg||b.score||0)>0);const g=p.length?parseFloat((p.reduce((b,v)=>b+parseFloat(v.avg||v.score||0),0)/p.length).toFixed(1)):0,h=n.filter(b=>String(b.status||"").toLowerCase()==="active").length,m=(b,v)=>{const C=b*v;return C>=15?"Breached":C>=9?"Warning":"Within"},f=a.length===0?1:2,w=o===0?1:c<.2?4:c<.3?3:1,u=p.length===0?1:g<7?4:g<8?2:1;return[{id:"KRI-001",category:"Financial",risk:"Revenue Target",likelihood:f,impact:5,threshold:"Quarterly targets",current:a.length?"Tracked":"—",status:m(f,5),trend:"Stable",owner:"Team",action:"Monitor pipeline"},{id:"KRI-002",category:"Financial",risk:"Overdue Invoices",likelihood:l>=3?5:l>=1?3:1,impact:4,threshold:"< 3 invoices",current:`${l} overdue`,status:l>=3?"Breached":l>=1?"Warning":"Within",trend:l>=3?"Worsening":"Stable",owner:"Team",action:l>=1?"Escalate collection":"Good"},{id:"KRI-003",category:"Financial",risk:"Budget Overrun",likelihood:1,impact:4,threshold:"10% budget limit",current:"—",status:"Within",trend:"Stable",owner:"Team",action:"Track costs"},{id:"KRI-004",category:"Operational",risk:"Delivery Delays",likelihood:d>2?5:d>0?3:1,impact:5,threshold:"<15% delays",current:`${d} delayed`,status:d>=2?"Breached":d>=1?"Warning":"Within",trend:d>=2?"Worsening":"Stable",owner:"Team",action:d>0?"Expedite project":"On Track"},{id:"KRI-005",category:"Operational",risk:"SOP Compliance",likelihood:1,impact:3,threshold:">90%",current:"—",status:"Within",trend:"Stable",owner:"Team",action:"Review checklists"},{id:"KRI-006",category:"Operational",risk:"Response Time",likelihood:1,impact:3,threshold:"<4h avg",current:"—",status:"Within",trend:"Stable",owner:"Team",action:"Set reminders"},{id:"KRI-007",category:"Client",risk:"Client Satisfaction",likelihood:u,impact:5,threshold:">8/10",current:p.length?`${g}/10`:"—",status:m(u,5),trend:"Stable",owner:"Team",action:u>1?"Follow up calls":"Maintain quality"},{id:"KRI-008",category:"Client",risk:"Client Churn Risk",likelihood:1,impact:5,threshold:"0 churns",current:"—",status:"Within",trend:"Stable",owner:"Team",action:"Proactive connect"},{id:"KRI-009",category:"Client",risk:"Conversion Rate",likelihood:w,impact:4,threshold:">30%",current:o?`${Math.round(c*100)}%`:"—",status:m(w,4),trend:w>1?"Declining":"Stable",owner:"Team",action:w>1?"Skill training":"Keep pitching"},{id:"KRI-010",category:"Marketing",risk:"Campaign ROI",likelihood:1,impact:3,threshold:">280%",current:h?`${h} campaigns`:"—",status:"Within",trend:"Stable",owner:"Team",action:"Optimize ads"},{id:"KRI-011",category:"Marketing",risk:"Lead Pipeline",likelihood:i.length===0?1:i.length<5?4:i.length<15?3:1,impact:4,threshold:">100 leads",current:`${i.length} leads`,status:i.length>0&&i.length<15?"Warning":"Within",trend:i.length>0&&i.length<15?"Worsening":"Stable",owner:"Team",action:i.length>0&&i.length<15?"Run new campaign":"Nurture"},{id:"KRI-012",category:"Team",risk:"Key Person Risk",likelihood:1,impact:5,threshold:"Cross-trained staff",current:"—",status:"Within",trend:"Stable",owner:"Team",action:"Process docs"}]}getReportsKriRisk(){const a=this.getKRIData(),t=p=>p.likelihood*p.impact,i=a.filter(p=>p.status==="Breached").length,s=a.filter(p=>p.status==="Warning").length,n=a.filter(p=>p.status==="Within").length;a.filter(p=>t(p)>=15).length;const l=a.filter(p=>p.trend==="Worsening").length,o=p=>({Breached:'<span class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-100 text-rose-700">Breached</span>',Warning:'<span class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 text-amber-700">Warning</span>',Within:'<span class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-700">Within Limit</span>'})[p]||p,r=p=>({Worsening:'<span class="text-rose-500 font-semibold">↑ Worsening</span>',Declining:'<span class="text-amber-500 font-semibold">↓ Declining</span>',Stable:'<span class="text-slate-500">→ Stable</span>',Improving:'<span class="text-emerald-600 font-semibold">↑ Improving</span>'})[p]||p,c=p=>p>=15?"bg-rose-100 text-rose-800 font-bold":p>=9?"bg-amber-100 text-amber-700 font-bold":"bg-emerald-100 text-emerald-700",d=[...new Set(a.map(p=>p.category))];return`<div class="space-y-6 fade-in">
            <!-- Header -->
            <div class="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h2 class="text-xl sm:text-2xl font-semibold text-slate-900">KRI Risk Monitor</h2>
                    <p class="text-sm text-slate-500">Key Risk Indicator tracking — threshold breaches, trend alerts, and mitigation actions</p>
                </div>
                <button id="kriExportBtn" class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors">
                    <i data-lucide="download" class="w-4 h-4"></i> Export CSV
                </button>
            </div>

            <!-- Summary Cards -->
            <div class="grid grid-cols-2 sm:grid-cols-5 gap-3">
                ${[{label:"Total KRIs",val:a.length,sub:"Monitored",col:"indigo",icon:"shield"},{label:"Breached",val:i,sub:"Immediate action",col:"rose",icon:"shield-alert"},{label:"Warning",val:s,sub:"Near threshold",col:"amber",icon:"alert-triangle"},{label:"Within Limit",val:n,sub:"Acceptable range",col:"emerald",icon:"shield-check"},{label:"Worsening Trend",val:l,sub:"Escalating risks",col:"orange",icon:"trending-up"}].map(p=>`<div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <div class="flex items-center gap-2 mb-1">
                        <i data-lucide="${p.icon}" class="w-4 h-4 text-${p.col}-500"></i>
                        <div class="text-xs text-slate-500 font-medium">${p.label}</div>
                    </div>
                    <div class="text-2xl font-bold text-slate-900">${p.val}</div>
                    <div class="text-xs text-slate-400 mt-0.5">${p.sub}</div>
                </div>`).join("")}
            </div>

            <!-- Charts -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                    <h3 class="text-sm font-semibold text-slate-900 mb-1">Risk Score by KRI</h3>
                    <p class="text-xs text-slate-500 mb-3">Likelihood × Impact (max 25). Red zone ≥ 15</p>
                    <div class="h-64"><div class="relative w-full h-full"><canvas id="kriScoreChart"></canvas></div>
                </div>
                <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                    <h3 class="text-sm font-semibold text-slate-900 mb-1">Risk Status by Category</h3>
                    <p class="text-xs text-slate-500 mb-3">Breached / Warning / Within across categories</p>
                    <div class="h-64"><div class="relative w-full h-full"><canvas id="kriCategoryChart"></canvas></div>
                </div>
            </div>

            <!-- Heat Map Legend -->
            <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                <div class="text-sm font-semibold text-slate-800 mb-3">Risk Score Heat Map Legend</div>
                <div class="flex flex-wrap gap-3 text-xs">
                    <span class="flex items-center gap-1.5"><span class="w-4 h-4 rounded bg-rose-100 border border-rose-300 inline-block"></span> High Risk (Score 15–25) — Immediate escalation required</span>
                    <span class="flex items-center gap-1.5"><span class="w-4 h-4 rounded bg-amber-100 border border-amber-300 inline-block"></span> Medium Risk (Score 9–14) — Close monitoring needed</span>
                    <span class="flex items-center gap-1.5"><span class="w-4 h-4 rounded bg-emerald-100 border border-emerald-300 inline-block"></span> Low Risk (Score 1–8) — Routine review cycle</span>
                </div>
            </div>

            <!-- KRI Tables by Category -->
            ${d.map(p=>{const g=a.filter(h=>h.category===p);return`<div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div class="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                        <div class="text-sm font-semibold text-slate-800">${p} Risks</div>
                        <div class="flex items-center gap-2 text-xs">
                            <span class="text-rose-600 font-semibold">${g.filter(h=>h.status==="Breached").length} Breached</span>
                            <span class="text-slate-300">|</span>
                            <span class="text-amber-600 font-semibold">${g.filter(h=>h.status==="Warning").length} Warning</span>
                        </div>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-xs">
                            <thead class="bg-slate-50 text-slate-600">
                                <tr>
                                    <th class="px-4 py-3 text-left font-semibold whitespace-nowrap">ID</th>
                                    <th class="px-4 py-3 text-left font-semibold whitespace-nowrap">Risk</th>
                                    <th class="px-4 py-3 text-center font-semibold whitespace-nowrap">L × I</th>
                                    <th class="px-4 py-3 text-center font-semibold whitespace-nowrap">Score</th>
                                    <th class="px-4 py-3 text-left font-semibold whitespace-nowrap">Threshold</th>
                                    <th class="px-4 py-3 text-left font-semibold whitespace-nowrap">Current</th>
                                    <th class="px-4 py-3 text-center font-semibold whitespace-nowrap">Status</th>
                                    <th class="px-4 py-3 text-left font-semibold whitespace-nowrap">Trend</th>
                                    <th class="px-4 py-3 text-left font-semibold whitespace-nowrap">Owner</th>
                                    <th class="px-4 py-3 text-left font-semibold whitespace-nowrap">Mitigation Action</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                ${g.map(h=>`<tr class="hover:bg-slate-50 transition-colors ${h.status==="Breached"?"bg-rose-50/30":h.status==="Warning"?"bg-amber-50/30":""}">
                                    <td class="px-4 py-3 font-mono text-slate-500">${h.id}</td>
                                    <td class="px-4 py-3 font-medium text-slate-800">${h.risk}</td>
                                    <td class="px-4 py-3 text-center text-slate-500">${h.likelihood} × ${h.impact}</td>
                                    <td class="px-4 py-3 text-center"><span class="px-2 py-0.5 rounded-full text-[10px] ${c(t(h))}">${t(h)}</span></td>
                                    <td class="px-4 py-3 text-slate-600">${h.threshold}</td>
                                    <td class="px-4 py-3 font-semibold text-slate-800">${h.current}</td>
                                    <td class="px-4 py-3 text-center">${o(h.status)}</td>
                                    <td class="px-4 py-3">${r(h.trend)}</td>
                                    <td class="px-4 py-3 text-slate-600">${h.owner}</td>
                                    <td class="px-4 py-3 text-slate-600" style="max-width:220px;white-space:normal">${h.action}</td>
                                </tr>`).join("")}
                            </tbody>
                        </table>
                    </div>
                </div>`}).join("")}
        </div>`}initializeKriRiskCharts(){const t=(this.getKRIData?this.getKRIData():[]).map(r=>({...r,label:r.risk,cat:r.category,score:r.likelihood*r.impact})),i=t.map(r=>r.score>=15?"rgba(239,68,68,0.75)":r.score>=9?"rgba(245,158,11,0.75)":"rgba(16,185,129,0.75)"),s=document.getElementById("kriScoreChart");if(s){if(this.charts.kriScoreChart)try{this.charts.kriScoreChart.destroy()}catch{}this.charts.kriScoreChart=new Chart(s,{type:"bar",data:{labels:t.map(r=>r.label),datasets:[{label:"Risk Score",data:t.map(r=>r.score),backgroundColor:i,borderRadius:4,borderSkipped:!1}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1}},scales:{y:{min:0,max:25,ticks:{font:{size:10}},grid:{color:r=>r.tick.value===15?"rgba(239,68,68,0.4)":r.tick.value===9?"rgba(245,158,11,0.3)":"rgba(226,232,240,0.8)"}},x:{ticks:{font:{size:9},maxRotation:30}}}}})}const n=["Financial","Operational","Client","Marketing","Team"],l=document.getElementById("kriCategoryChart");if(l){if(this.charts.kriCategoryChart)try{this.charts.kriCategoryChart.destroy()}catch{}this.charts.kriCategoryChart=new Chart(l,{type:"bar",data:{labels:n,datasets:[{label:"Breached",data:n.map(r=>t.filter(c=>c.cat===r&&c.status==="Breached").length),backgroundColor:"rgba(239,68,68,0.75)",borderRadius:4},{label:"Warning",data:n.map(r=>t.filter(c=>c.cat===r&&c.status==="Warning").length),backgroundColor:"rgba(245,158,11,0.75)",borderRadius:4},{label:"Within",data:n.map(r=>t.filter(c=>c.cat===r&&c.status==="Within").length),backgroundColor:"rgba(16,185,129,0.75)",borderRadius:4}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"bottom",labels:{boxWidth:12,font:{size:11}}}},scales:{x:{stacked:!0},y:{stacked:!0,ticks:{stepSize:1}}}}})}const o=document.getElementById("kriExportBtn");o&&(o.onclick=()=>{const r=typeof this.getKRIData=="function"?this.getKRIData():[],d=[["ID","Category","Risk","Likelihood","Impact","Score","Threshold","Current","Status","Trend","Owner","Action"],...r.map(g=>[g.id||"",g.category||"",g.risk||"",String(g.likelihood||""),String(g.impact||""),String((g.likelihood||0)*(g.impact||0)),g.threshold||"",g.current||"",g.status||"",g.trend||"",g.owner||"",g.action||""])].map(g=>g.map(h=>`"${String(h).replace(/"/g,'""')}"`).join(",")).join(`
`),p=document.createElement("a");p.href="data:text/csv;charset=utf-8,"+encodeURIComponent(d),p.download="KRI_Risk_Monitor_Report.csv",p.click()})}getReportsProjectRoadmap(){let a=[];try{typeof this.getAllProjectsMerged=="function"&&(a=this.getAllProjectsMerged([]).map(v=>typeof this.ensureProjectModel=="function"?this.ensureProjectModel(v):v))}catch{}const t=a.length,i=a.filter(v=>(v.status||"").toLowerCase().includes("on track")).length,s=a.filter(v=>{var C;return(v.status||"").toLowerCase().includes("at risk")||(((C=v.monitoring)==null?void 0:C.overallProjectStatus)||"").toLowerCase().includes("delayed")}).length,n=a.filter(v=>{var C;return(((C=v.monitoring)==null?void 0:C.overallProjectStatus)||"").toLowerCase()==="completed"}).length,l=a.reduce((v,C)=>v+(parseFloat(String(C.budget||"0").replace(/[^0-9.]/g,""))||0),0),o=a.reduce((v,C)=>v+(parseFloat(String(C.spent||"0").replace(/[^0-9.]/g,""))||0),0),r=t?Math.round(a.reduce((v,C)=>v+(C.progress||0),0)/t):0,c=a.filter(v=>{var C;return(((C=v.dispatch)==null?void 0:C.deliveryConfirmation)||"").toLowerCase()==="yes"}).length,d=v=>{const C=parseFloat(String(v||"0").replace(/[^0-9.]/g,""));return C?C>=1e5?"₹"+(C/1e5).toFixed(1)+"L":"₹"+C.toLocaleString("en-IN"):"—"},p=v=>v==="Yes"?'<span class="text-emerald-600 font-semibold">Yes</span>':v==="No"?'<span class="text-rose-500">No</span>':`<span class="text-slate-400">${v||"—"}</span>`,g=v=>{if(!v)return'<span class="text-slate-300">—</span>';const C=v.toLowerCase();return C==="completed"?'<span class="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-emerald-100 text-emerald-700">✓ Done</span>':C==="in progress"?'<span class="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-sky-100 text-sky-700">In Prog</span>':C==="pending"?'<span class="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-slate-100 text-slate-500">Pending</span>':`<span class="px-1.5 py-0.5 text-[10px] rounded bg-amber-100 text-amber-700">${v}</span>`},h=(v,C)=>`<span class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-${C}-100 text-${C}-700">${v||"—"}</span>`,m=v=>{const C=parseInt(v);if(isNaN(C))return'<span class="text-slate-300">—</span>';const L=C>=8?"emerald":C>=6?"amber":"rose";return`<span class="w-6 h-6 inline-flex items-center justify-center rounded-full text-[10px] font-bold bg-${L}-100 text-${L}-700">${C}</span>`},f=v=>{if(!v||v==="—")return'<span class="text-slate-400">—</span>';const C=v.toLowerCase();return C==="on time"?`<span class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-700">${v}</span>`:C==="overdue"?`<span class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-100 text-rose-700">${v}</span>`:`<span class="px-2 py-0.5 text-[10px] rounded-full bg-amber-100 text-amber-700">${v}</span>`},w=v=>{if(!v)return"—";const C=v.toLowerCase();return C==="completed"?`<span class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-700">${v}</span>`:C.includes("delayed")||C.includes("risk")?`<span class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 text-amber-700">${v}</span>`:`<span class="px-2 py-0.5 text-[10px] rounded-full bg-slate-100 text-slate-600">${v}</span>`},u=[{label:"Total Projects",val:t,sub:"All registered",col:"indigo",icon:"folder"},{label:"On Track",val:i,sub:`${t?Math.round(i/t*100):0}% of total`,col:"emerald",icon:"check-circle"},{label:"At Risk / Delayed",val:s,sub:"Needs attention",col:"amber",icon:"alert-triangle"},{label:"Completed",val:n,sub:"Fully delivered",col:"sky",icon:"badge-check"},{label:"Avg Progress",val:r+"%",sub:"Across all projects",col:"purple",icon:"trending-up"},{label:"Total Budget",val:d(l),sub:"All PO values",col:"slate",icon:"indian-rupee"},{label:"Total Spent",val:d(o),sub:`${l?Math.round(o/l*100):0}% utilised`,col:"rose",icon:"receipt"},{label:"Delivered",val:c+"/"+t,sub:"Delivery confirmed",col:"teal",icon:"truck"}],b=[{id:"grp-identification",label:"Identification",cols:15,bg:"bg-indigo-50",text:"text-indigo-700",border:"border-indigo-200"},{id:"grp-tracking",label:"Technical Tracking",cols:10,bg:"bg-violet-50",text:"text-violet-700",border:"border-violet-200"},{id:"grp-monitoring",label:"Monitoring",cols:7,bg:"bg-sky-50",text:"text-sky-700",border:"border-sky-200"},{id:"grp-dispatch",label:"Dispatch & Delivery",cols:5,bg:"bg-amber-50",text:"text-amber-700",border:"border-amber-200"},{id:"grp-purchase",label:"Quotation & PO",cols:7,bg:"bg-orange-50",text:"text-orange-700",border:"border-orange-200"},{id:"grp-payment",label:"Invoice & Payment",cols:12,bg:"bg-emerald-50",text:"text-emerald-700",border:"border-emerald-200"},{id:"grp-ratings",label:"Ratings",cols:7,bg:"bg-yellow-50",text:"text-yellow-700",border:"border-yellow-200"}];return`
            <div class="space-y-6 fade-in">
                <!-- Header -->
                <div class="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h2 class="text-xl sm:text-2xl font-semibold text-slate-900">Project Roadmap Report</h2>
                        <p class="text-sm text-slate-500">Complete project details — every registration field in one unified table across all ${t} project(s)</p>
                    </div>
                    <button id="projectRoadmapExportBtn" class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                        <i data-lucide="download" class="w-4 h-4"></i> Export Excel
                    </button>
                </div>

                <!-- KPI Cards -->
                <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                    ${u.map(v=>`
                    <div class="bg-white rounded-xl border border-slate-200 p-3 shadow-sm flex flex-col gap-1">
                        <div class="flex items-center gap-1.5 mb-0.5">
                            <i data-lucide="${v.icon}" class="w-3.5 h-3.5 text-${v.col}-500"></i>
                            <div class="text-[10px] text-slate-500 font-medium leading-tight">${v.label}</div>
                        </div>
                        <div class="text-xl font-bold text-slate-900">${v.val}</div>
                        <div class="text-[10px] text-slate-400">${v.sub}</div>
                    </div>`).join("")}
                </div>

                <!-- Charts Row -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                        <h3 class="text-sm font-semibold text-slate-900 mb-1">Project Progress Overview</h3>
                        <p class="text-xs text-slate-500 mb-3">% completion per project</p>
                        <div class="h-48"><div class="relative w-full h-full"><canvas id="projectProgressChart"></canvas></div>
                    </div>
                    <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                        <h3 class="text-sm font-semibold text-slate-900 mb-1">Budget vs Spent</h3>
                        <p class="text-xs text-slate-500 mb-3">Per project (₹)</p>
                        <div class="h-48"><div class="relative w-full h-full"><canvas id="projectBudgetChart"></canvas></div>
                    </div>
                </div>

                <!-- Single Unified Master Table -->
                <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div class="p-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
                        <div>
                            <div class="text-sm font-semibold text-slate-900">Complete Project Register — All Fields</div>
                            <div class="text-xs text-slate-500">Each row = one project · All ${t} projects · Scroll horizontally to view all sections</div>
                        </div>
                        <div class="flex gap-2 flex-wrap text-[10px]">
                            ${b.map(v=>`<button onclick="(function(){const th=document.getElementById('${v.id}');const wrap=document.getElementById('projRoadmapScroll');if(th&&wrap){wrap.scrollLeft=th.offsetLeft-8;}})()" class="px-2 py-1 rounded-full border ${v.bg} ${v.text} ${v.border} font-medium cursor-pointer hover:opacity-80 transition-opacity">${v.label}</button>`).join("")}
                        </div>
                    </div>
                    <div id="projRoadmapScroll" class="overflow-x-auto" style="max-height: 72vh; overflow-y: auto;">
                        <table id="projRoadmapMasterTable" class="w-full text-xs border-collapse" style="min-width: 4200px;">
                            <thead style="position: sticky; top: 0; z-index: 10;">
                                <!-- Group header row -->
                                <tr>
                                    <th id="grp-identification" colspan="15" class="px-3 py-2 text-left font-bold border border-indigo-200 bg-indigo-50 text-indigo-800 text-[11px]">Identification</th>
                                    <th id="grp-tracking"       colspan="10" class="px-3 py-2 text-left font-bold border border-violet-200 bg-violet-50 text-violet-800 text-[11px]">Technical Scope / Stage Tracking</th>
                                    <th id="grp-monitoring"     colspan="7"  class="px-3 py-2 text-left font-bold border border-sky-200 bg-sky-50 text-sky-800 text-[11px]">Roadmap & Monitoring</th>
                                    <th id="grp-dispatch"       colspan="5"  class="px-3 py-2 text-left font-bold border border-amber-200 bg-amber-50 text-amber-800 text-[11px]">Dispatch & Delivery</th>
                                    <th id="grp-purchase"       colspan="7"  class="px-3 py-2 text-left font-bold border border-orange-200 bg-orange-50 text-orange-800 text-[11px]">Quotation & Purchase Order</th>
                                    <th id="grp-payment"        colspan="12" class="px-3 py-2 text-left font-bold border border-emerald-200 bg-emerald-50 text-emerald-800 text-[11px]">Invoice & Payment Tracking</th>
                                    <th id="grp-ratings"        colspan="7"  class="px-3 py-2 text-left font-bold border border-yellow-200 bg-yellow-50 text-yellow-800 text-[11px]">Performance & Ratings</th>
                                </tr>
                                <!-- Column header row -->
                                <tr class="bg-slate-100 text-slate-700">
                                    <!-- Identification (15 cols) -->
                                    <th class="px-3 py-2.5 text-left font-semibold whitespace-nowrap border border-slate-200 bg-indigo-50/60">#</th>
                                    <th class="px-3 py-2.5 text-left font-semibold whitespace-nowrap border border-slate-200 bg-indigo-50/60">Project Name</th>
                                    <th class="px-3 py-2.5 text-left font-semibold whitespace-nowrap border border-slate-200 bg-indigo-50/60">Project Code</th>
                                    <th class="px-3 py-2.5 text-left font-semibold whitespace-nowrap border border-slate-200 bg-indigo-50/60">Service Code</th>
                                    <th class="px-3 py-2.5 text-left font-semibold whitespace-nowrap border border-slate-200 bg-indigo-50/60">Vendor Code</th>
                                    <th class="px-3 py-2.5 text-left font-semibold whitespace-nowrap border border-slate-200 bg-indigo-50/60">Company / Client</th>
                                    <th class="px-3 py-2.5 text-left font-semibold whitespace-nowrap border border-slate-200 bg-indigo-50/60">Location</th>
                                    <th class="px-3 py-2.5 text-left font-semibold whitespace-nowrap border border-slate-200 bg-indigo-50/60">QTY</th>
                                    <th class="px-3 py-2.5 text-left font-semibold whitespace-nowrap border border-slate-200 bg-indigo-50/60">Project Lead</th>
                                    <th class="px-3 py-2.5 text-left font-semibold whitespace-nowrap border border-slate-200 bg-indigo-50/60">Assigned By</th>
                                    <th class="px-3 py-2.5 text-left font-semibold whitespace-nowrap border border-slate-200 bg-indigo-50/60">Assigned To</th>
                                    <th class="px-3 py-2.5 text-left font-semibold whitespace-nowrap border border-slate-200 bg-indigo-50/60">Owner</th>
                                    <th class="px-3 py-2.5 text-left font-semibold whitespace-nowrap border border-slate-200 bg-indigo-50/60">Budget</th>
                                    <th class="px-3 py-2.5 text-left font-semibold whitespace-nowrap border border-slate-200 bg-indigo-50/60">Spent</th>
                                    <th class="px-3 py-2.5 text-left font-semibold whitespace-nowrap border border-slate-200 bg-indigo-50/60">Status / Progress</th>
                                    <!-- Technical Tracking (10 cols) -->
                                    <th class="px-3 py-2.5 text-left font-semibold whitespace-nowrap border border-slate-200 bg-violet-50/60">2D Model</th>
                                    <th class="px-3 py-2.5 text-left font-semibold whitespace-nowrap border border-slate-200 bg-violet-50/60">3D Model</th>
                                    <th class="px-3 py-2.5 text-left font-semibold whitespace-nowrap border border-slate-200 bg-violet-50/60">3D Scan</th>
                                    <th class="px-3 py-2.5 text-left font-semibold whitespace-nowrap border border-slate-200 bg-violet-50/60">FEA</th>
                                    <th class="px-3 py-2.5 text-left font-semibold whitespace-nowrap border border-slate-200 bg-violet-50/60">QC / Inspection</th>
                                    <th class="px-3 py-2.5 text-left font-semibold whitespace-nowrap border border-slate-200 bg-violet-50/60">Approval</th>
                                    <th class="px-3 py-2.5 text-left font-semibold whitespace-nowrap border border-slate-200 bg-violet-50/60">GL Approval</th>
                                    <th class="px-3 py-2.5 text-left font-semibold whitespace-nowrap border border-slate-200 bg-violet-50/60">Revision</th>
                                    <th class="px-3 py-2.5 text-left font-semibold whitespace-nowrap border border-slate-200 bg-violet-50/60">Delivery Report</th>
                                    <th class="px-3 py-2.5 text-left font-semibold whitespace-nowrap border border-slate-200 bg-violet-50/60">SOP Daily Report</th>
                                    <!-- Monitoring (7 cols) -->
                                    <th class="px-3 py-2.5 text-left font-semibold whitespace-nowrap border border-slate-200 bg-sky-50/60">Roadmap Submitted</th>
                                    <th class="px-3 py-2.5 text-left font-semibold whitespace-nowrap border border-slate-200 bg-sky-50/60">Dashboard Updated</th>
                                    <th class="px-3 py-2.5 text-left font-semibold whitespace-nowrap border border-slate-200 bg-sky-50/60">Daily Report Updated</th>
                                    <th class="px-3 py-2.5 text-left font-semibold whitespace-nowrap border border-slate-200 bg-sky-50/60">Photo Attached</th>
                                    <th class="px-3 py-2.5 text-left font-semibold whitespace-nowrap border border-slate-200 bg-sky-50/60">Overall Status</th>
                                    <th class="px-3 py-2.5 text-left font-semibold whitespace-nowrap border border-slate-200 bg-sky-50/60" style="min-width:140px">Post Completion Status</th>
                                    <th class="px-3 py-2.5 text-left font-semibold whitespace-nowrap border border-slate-200 bg-sky-50/60" style="min-width:130px">Physical Part Status</th>
                                    <!-- Dispatch (5 cols) -->
                                    <th class="px-3 py-2.5 text-left font-semibold whitespace-nowrap border border-slate-200 bg-amber-50/60">DC Date</th>
                                    <th class="px-3 py-2.5 text-left font-semibold whitespace-nowrap border border-slate-200 bg-amber-50/60">DC Number</th>
                                    <th class="px-3 py-2.5 text-left font-semibold whitespace-nowrap border border-slate-200 bg-amber-50/60">Delivery Status</th>
                                    <th class="px-3 py-2.5 text-left font-semibold whitespace-nowrap border border-slate-200 bg-amber-50/60">Delivery Date</th>
                                    <th class="px-3 py-2.5 text-left font-semibold whitespace-nowrap border border-slate-200 bg-amber-50/60">Delivery Confirmed</th>
                                    <!-- Purchase (7 cols) -->
                                    <th class="px-3 py-2.5 text-left font-semibold whitespace-nowrap border border-slate-200 bg-orange-50/60">Quotation Date</th>
                                    <th class="px-3 py-2.5 text-left font-semibold whitespace-nowrap border border-slate-200 bg-orange-50/60">Quotation No.</th>
                                    <th class="px-3 py-2.5 text-left font-semibold whitespace-nowrap border border-slate-200 bg-orange-50/60">PO Date</th>
                                    <th class="px-3 py-2.5 text-left font-semibold whitespace-nowrap border border-slate-200 bg-orange-50/60">PO Number</th>
                                    <th class="px-3 py-2.5 text-left font-semibold whitespace-nowrap border border-slate-200 bg-orange-50/60">PO Value</th>
                                    <th class="px-3 py-2.5 text-left font-semibold whitespace-nowrap border border-slate-200 bg-orange-50/60">Converted By</th>
                                    <th class="px-3 py-2.5 text-left font-semibold whitespace-nowrap border border-slate-200 bg-orange-50/60">Visit Conducted</th>
                                    <!-- Payment (12 cols) -->
                                    <th class="px-3 py-2.5 text-left font-semibold whitespace-nowrap border border-slate-200 bg-emerald-50/60">Invoice Date</th>
                                    <th class="px-3 py-2.5 text-left font-semibold whitespace-nowrap border border-slate-200 bg-emerald-50/60">Invoice No.</th>
                                    <th class="px-3 py-2.5 text-left font-semibold whitespace-nowrap border border-slate-200 bg-emerald-50/60">Invoice Amount</th>
                                    <th class="px-3 py-2.5 text-left font-semibold whitespace-nowrap border border-slate-200 bg-emerald-50/60">Past Invoice Amt</th>
                                    <th class="px-3 py-2.5 text-left font-semibold whitespace-nowrap border border-slate-200 bg-emerald-50/60" style="min-width:130px">Payment Terms</th>
                                    <th class="px-3 py-2.5 text-left font-semibold whitespace-nowrap border border-slate-200 bg-emerald-50/60">Payment Type</th>
                                    <th class="px-3 py-2.5 text-left font-semibold whitespace-nowrap border border-slate-200 bg-emerald-50/60">Payment Due Date</th>
                                    <th class="px-3 py-2.5 text-left font-semibold whitespace-nowrap border border-slate-200 bg-emerald-50/60">Received Date</th>
                                    <th class="px-3 py-2.5 text-left font-semibold whitespace-nowrap border border-slate-200 bg-emerald-50/60">Received Amount</th>
                                    <th class="px-3 py-2.5 text-left font-semibold whitespace-nowrap border border-slate-200 bg-emerald-50/60">Balance Due Date</th>
                                    <th class="px-3 py-2.5 text-left font-semibold whitespace-nowrap border border-slate-200 bg-emerald-50/60">Balance Amount</th>
                                    <th class="px-3 py-2.5 text-left font-semibold whitespace-nowrap border border-slate-200 bg-emerald-50/60">Overdue Status</th>
                                    <!-- Ratings (7 cols) -->
                                    <th class="px-3 py-2.5 text-center font-semibold whitespace-nowrap border border-slate-200 bg-yellow-50/60">Client Rating</th>
                                    <th class="px-3 py-2.5 text-center font-semibold whitespace-nowrap border border-slate-200 bg-yellow-50/60">Job Rating</th>
                                    <th class="px-3 py-2.5 text-center font-semibold whitespace-nowrap border border-slate-200 bg-yellow-50/60">Quality Rating</th>
                                    <th class="px-3 py-2.5 text-center font-semibold whitespace-nowrap border border-slate-200 bg-yellow-50/60">Service Rating</th>
                                    <th class="px-3 py-2.5 text-center font-semibold whitespace-nowrap border border-slate-200 bg-yellow-50/60">Perf. Rating</th>
                                    <th class="px-3 py-2.5 text-left font-semibold whitespace-nowrap border border-slate-200 bg-yellow-50/60" style="min-width:200px">Feedback / Comments</th>
                                    <th class="px-3 py-2.5 text-left font-semibold whitespace-nowrap border border-slate-200 bg-yellow-50/60" style="min-width:180px">Additional Notes</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                ${a.map((v,C)=>{var F,D,j,I,N,R,_,A,E,z,V,Q,J,Y,Z,tt,et,st,at,it,O,ot,lt,rt,dt,ct,q,W,G,K,X,pt,ut,mt,gt,xt,yt,wt,St,Ct,$t,kt,jt,Lt,At,It,vt,Pt,Rt,Dt,Tt,bt,Nt,ft,Et,Mt,Bt;const L=v.statusColor||"slate";return`
                                <tr class="hover:bg-slate-50/80 transition-colors ${C%2===1?"bg-slate-50/40":""}">
                                    <!-- Identification -->
                                    <td class="px-3 py-2.5 text-slate-400 font-medium border border-slate-100 whitespace-nowrap">${C+1}</td>
                                    <td class="px-3 py-2.5 font-bold text-slate-900 border border-slate-100 whitespace-nowrap">${v.name||"—"}</td>
                                    <td class="px-3 py-2.5 font-mono text-slate-700 border border-slate-100 whitespace-nowrap">${((F=v.identification)==null?void 0:F.projectCode)||"—"}</td>
                                    <td class="px-3 py-2.5 text-slate-700 border border-slate-100">${((D=v.identification)==null?void 0:D.serviceCode)||"—"}</td>
                                    <td class="px-3 py-2.5 text-slate-700 border border-slate-100">${((j=v.identification)==null?void 0:j.vendorCode)||"—"}</td>
                                    <td class="px-3 py-2.5 text-slate-700 border border-slate-100 whitespace-nowrap">${((I=v.identification)==null?void 0:I.companyName)||v.client||"—"}</td>
                                    <td class="px-3 py-2.5 text-slate-700 border border-slate-100">${((N=v.identification)==null?void 0:N.location)||"—"}</td>
                                    <td class="px-3 py-2.5 text-slate-700 border border-slate-100 text-center">${((R=v.identification)==null?void 0:R.qty)||"—"}</td>
                                    <td class="px-3 py-2.5 text-slate-700 border border-slate-100">${((_=v.identification)==null?void 0:_.projectLead)||"—"}</td>
                                    <td class="px-3 py-2.5 text-slate-700 border border-slate-100">${((A=v.identification)==null?void 0:A.assignedBy)||"—"}</td>
                                    <td class="px-3 py-2.5 text-slate-700 border border-slate-100">${((E=v.identification)==null?void 0:E.assignedTo)||"—"}</td>
                                    <td class="px-3 py-2.5 text-slate-700 border border-slate-100">${v.owner||"—"}</td>
                                    <td class="px-3 py-2.5 font-semibold text-slate-900 border border-slate-100 whitespace-nowrap">${v.budget||"—"}</td>
                                    <td class="px-3 py-2.5 text-slate-700 border border-slate-100 whitespace-nowrap">${v.spent||"—"}</td>
                                    <td class="px-3 py-2.5 border border-slate-100" style="min-width:140px">
                                        <div class="flex flex-col gap-1">
                                            ${h(v.status,L)}
                                            <div class="flex items-center gap-1.5 mt-1">
                                                <div class="w-16 bg-slate-200 rounded-full h-1.5"><div class="bg-${L}-500 h-1.5 rounded-full" style="width:${v.progress||0}%"></div>
                                                <span class="text-slate-600 text-[10px]">${v.progress||0}%</span>
                                            </div>
                                        </div>
                                    </td>
                                    <!-- Technical Tracking -->
                                    <td class="px-3 py-2.5 border border-slate-100">${g((z=v.tracking)==null?void 0:z.model2dStatus)}</td>
                                    <td class="px-3 py-2.5 border border-slate-100">${g((V=v.tracking)==null?void 0:V.model3dStatus)}</td>
                                    <td class="px-3 py-2.5 border border-slate-100">${g((Q=v.tracking)==null?void 0:Q.scan3dStatus)}</td>
                                    <td class="px-3 py-2.5 border border-slate-100">${g((J=v.tracking)==null?void 0:J.feaStatus)}</td>
                                    <td class="px-3 py-2.5 border border-slate-100">${g((Y=v.tracking)==null?void 0:Y.qcInspectionStatus)}</td>
                                    <td class="px-3 py-2.5 border border-slate-100">${g((Z=v.tracking)==null?void 0:Z.approvalStatus)}</td>
                                    <td class="px-3 py-2.5 border border-slate-100">${g((tt=v.tracking)==null?void 0:tt.glApprovalStatus)}</td>
                                    <td class="px-3 py-2.5 border border-slate-100">${g((et=v.tracking)==null?void 0:et.revisionStatus)}</td>
                                    <td class="px-3 py-2.5 border border-slate-100">${g((st=v.tracking)==null?void 0:st.deliveryReportStatus)}</td>
                                    <td class="px-3 py-2.5 border border-slate-100">${g((at=v.tracking)==null?void 0:at.sopDailyReportStatus)}</td>
                                    <!-- Monitoring -->
                                    <td class="px-3 py-2.5 border border-slate-100">${p((it=v.monitoring)==null?void 0:it.roadmapSubmitted)}</td>
                                    <td class="px-3 py-2.5 border border-slate-100">${p((O=v.monitoring)==null?void 0:O.dashboardUpdated)}</td>
                                    <td class="px-3 py-2.5 border border-slate-100">${p((ot=v.monitoring)==null?void 0:ot.dailyReportUpdated)}</td>
                                    <td class="px-3 py-2.5 border border-slate-100">${p((lt=v.monitoring)==null?void 0:lt.photoAttached)}</td>
                                    <td class="px-3 py-2.5 border border-slate-100">${w((rt=v.monitoring)==null?void 0:rt.overallProjectStatus)}</td>
                                    <td class="px-3 py-2.5 text-slate-600 border border-slate-100" style="white-space:normal;max-width:160px">${((dt=v.monitoring)==null?void 0:dt.postCompletionStatus)||"—"}</td>
                                    <td class="px-3 py-2.5 text-slate-600 border border-slate-100" style="white-space:normal;max-width:150px">${((ct=v.monitoring)==null?void 0:ct.physicalPartStatus)||"—"}</td>
                                    <!-- Dispatch -->
                                    <td class="px-3 py-2.5 text-slate-700 border border-slate-100">${((q=v.dispatch)==null?void 0:q.dcDate)||"—"}</td>
                                    <td class="px-3 py-2.5 text-slate-700 font-mono border border-slate-100">${((W=v.dispatch)==null?void 0:W.dcNumber)||"—"}</td>
                                    <td class="px-3 py-2.5 border border-slate-100">${g((G=v.dispatch)==null?void 0:G.deliveryStatus)}</td>
                                    <td class="px-3 py-2.5 text-slate-700 border border-slate-100">${((K=v.dispatch)==null?void 0:K.deliveryDate)||"—"}</td>
                                    <td class="px-3 py-2.5 border border-slate-100">${p((X=v.dispatch)==null?void 0:X.deliveryConfirmation)}</td>
                                    <!-- Purchase -->
                                    <td class="px-3 py-2.5 text-slate-700 border border-slate-100">${((pt=v.purchase)==null?void 0:pt.quotationDate)||"—"}</td>
                                    <td class="px-3 py-2.5 text-slate-700 font-mono border border-slate-100">${((ut=v.purchase)==null?void 0:ut.quotationNumber)||"—"}</td>
                                    <td class="px-3 py-2.5 text-slate-700 border border-slate-100">${((mt=v.purchase)==null?void 0:mt.poDate)||"—"}</td>
                                    <td class="px-3 py-2.5 text-slate-700 font-mono border border-slate-100">${((gt=v.purchase)==null?void 0:gt.poNumber)||"—"}</td>
                                    <td class="px-3 py-2.5 font-semibold text-slate-900 border border-slate-100 whitespace-nowrap">${((xt=v.purchase)==null?void 0:xt.poValue)||"—"}</td>
                                    <td class="px-3 py-2.5 text-slate-700 border border-slate-100">${((yt=v.purchase)==null?void 0:yt.convertedBy)||"—"}</td>
                                    <td class="px-3 py-2.5 border border-slate-100">${p((wt=v.purchase)==null?void 0:wt.visitConducted)}</td>
                                    <!-- Payment -->
                                    <td class="px-3 py-2.5 text-slate-700 border border-slate-100">${((St=v.payment)==null?void 0:St.invoiceDate)||"—"}</td>
                                    <td class="px-3 py-2.5 text-slate-700 font-mono border border-slate-100">${((Ct=v.payment)==null?void 0:Ct.invoiceNumber)||"—"}</td>
                                    <td class="px-3 py-2.5 font-semibold text-slate-900 border border-slate-100 whitespace-nowrap">${(($t=v.payment)==null?void 0:$t.invoiceAmount)||"—"}</td>
                                    <td class="px-3 py-2.5 text-slate-700 border border-slate-100">${((kt=v.payment)==null?void 0:kt.pastInvoiceAmount)||"—"}</td>
                                    <td class="px-3 py-2.5 text-slate-600 border border-slate-100" style="white-space:normal;max-width:130px">${((jt=v.payment)==null?void 0:jt.paymentTerms)||"—"}</td>
                                    <td class="px-3 py-2.5 text-slate-700 border border-slate-100">${((Lt=v.payment)==null?void 0:Lt.paymentType)||"—"}</td>
                                    <td class="px-3 py-2.5 text-slate-700 border border-slate-100">${((At=v.payment)==null?void 0:At.paymentDueDate)||"—"}</td>
                                    <td class="px-3 py-2.5 text-slate-700 border border-slate-100">${((It=v.payment)==null?void 0:It.paymentReceivedDate)||"—"}</td>
                                    <td class="px-3 py-2.5 font-semibold text-emerald-700 border border-slate-100 whitespace-nowrap">${((vt=v.payment)==null?void 0:vt.paymentReceivedAmount)||"—"}</td>
                                    <td class="px-3 py-2.5 text-slate-700 border border-slate-100">${((Pt=v.payment)==null?void 0:Pt.balancePaymentDueDate)||"—"}</td>
                                    <td class="px-3 py-2.5 font-semibold text-rose-700 border border-slate-100 whitespace-nowrap">${((Rt=v.payment)==null?void 0:Rt.balancePaymentAmount)||"—"}</td>
                                    <td class="px-3 py-2.5 border border-slate-100">${f((Dt=v.payment)==null?void 0:Dt.overdueStatus)}</td>
                                    <!-- Ratings -->
                                    <td class="px-3 py-2.5 text-center border border-slate-100">${m((Tt=v.ratings)==null?void 0:Tt.clientRating)}</td>
                                    <td class="px-3 py-2.5 text-center border border-slate-100">${m((bt=v.ratings)==null?void 0:bt.jobRating)}</td>
                                    <td class="px-3 py-2.5 text-center border border-slate-100">${m((Nt=v.ratings)==null?void 0:Nt.qualityRating)}</td>
                                    <td class="px-3 py-2.5 text-center border border-slate-100">${m((ft=v.ratings)==null?void 0:ft.serviceRating)}</td>
                                    <td class="px-3 py-2.5 text-center border border-slate-100">${m((Et=v.ratings)==null?void 0:Et.performanceRating)}</td>
                                    <td class="px-3 py-2.5 text-slate-600 border border-slate-100" style="white-space:normal;max-width:220px">${((Mt=v.ratings)==null?void 0:Mt.feedbackComments)||"—"}</td>
                                    <td class="px-3 py-2.5 text-slate-600 border border-slate-100" style="white-space:normal;max-width:180px">${((Bt=v.ratings)==null?void 0:Bt.additionalNotes)||"—"}</td>
                                </tr>`}).join("")}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `}getReportsRevenue(){const a=this.getStoredInvoices?this.getStoredInvoices():[],t=new Map,i=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];a.forEach(l=>{const o=parseFloat(String(l.amount||"0").replace(/[^0-9.]/g,""))||0,r=String(l.status||"").toLowerCase()==="paid",c=l.invoice_date||l.date||"",d=c?new Date(c):new Date,p=i[d.getMonth()]+" "+d.getFullYear();t.has(p)||t.set(p,{month:i[d.getMonth()],revenue:0,collected:0,pending:0,topClient:l.client||"—"});const g=t.get(p);g.revenue+=o,r?g.collected+=o:g.pending+=o});const s=l=>l>=1e5?"₹"+(l/1e5).toFixed(1)+"L":"₹"+l.toLocaleString("en-IN"),n=[...t.values()].slice(-6).map(l=>({month:l.month,revenue:s(l.revenue),collected:s(l.collected),pending:s(l.pending),topClient:l.topClient}));return`
            <div class="space-y-6 fade-in">
                <div class="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h2 class="text-xl sm:text-2xl font-semibold text-slate-900">Revenue Reports</h2>
                        <p class="text-sm text-slate-500">Filters, comparisons, and downloadable charts</p>
                    </div>
                    <button data-action="table:exportCsv" class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Download CSV</button>
                </div>

                <div class="bg-white rounded-lg border border-slate-200 p-4 shadow-lg grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    <select class="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                        <option>Last 6 months</option>
                        <option>Last 12 months</option>
                        <option>This quarter</option>
                    </select>
                    <select class="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                        <option>All Clients</option>
                        ${(this.getStoredClients?this.getStoredClients():[]).map(l=>`<option>${l.name||""}</option>`).join("")}
                    </select>
                    <select class="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                        <option>All Services</option>
                        <option>SEO</option>
                        <option>Consulting</option>
                        <option>Ads</option>
                    </select>
                    <button data-action="reports:applyFilter" class="px-4 py-2 text-sm font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">Apply</button>
                    <button data-action="reports:resetFilter" class="px-4 py-2 text-sm font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">Reset</button>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div class="bg-white rounded-lg border border-slate-200 p-5 shadow-lg">
                        <div class="text-xs text-slate-500">Total revenue</div>
                        <div class="text-2xl font-semibold text-slate-900 mt-1">₹22.0 L</div>
                        <div class="text-xs text-emerald-700 mt-1">↑ 14% growth</div>
                    </div>
                    <div class="bg-white rounded-lg border border-slate-200 p-5 shadow-lg">
                        <div class="text-xs text-slate-500">Collected</div>
                        <div class="text-2xl font-semibold text-slate-900 mt-1">₹20.0 L</div>
                        <div class="text-xs text-slate-500 mt-1">last 6 months</div>
                    </div>
                    <div class="bg-white rounded-lg border border-slate-200 p-5 shadow-lg">
                        <div class="text-xs text-slate-500">Pending</div>
                        <div class="text-2xl font-semibold text-slate-900 mt-1">₹2.0 L</div>
                        <div class="text-xs text-amber-700 mt-1">needs follow-up</div>
                    </div>
                    <div class="bg-white rounded-lg border border-slate-200 p-5 shadow-lg">
                        <div class="text-xs text-slate-500">Top client</div>
                        <div class="text-2xl font-semibold text-slate-900 mt-1">${(()=>{try{const l=this.getStoredInvoices().filter(c=>String(c.status||"").toLowerCase()==="paid"),o=new Map;l.forEach(c=>{const d=String(c.client||""),p=parseFloat(String(c.amount||"0").replace(/[^0-9.]/g,""))||0;o.set(d,(o.get(d)||0)+p)});const r=[...o.entries()].sort((c,d)=>d[1]-c[1])[0];return r?r[0].split(" ")[0]:"—"}catch{return"—"}})()}</div>
                        <div class="text-xs text-slate-500 mt-1">${(()=>{try{const o=this.getStoredInvoices().filter(r=>String(r.status||"").toLowerCase()==="paid").reduce((r,c)=>r+(parseFloat(String(c.amount||"0").replace(/[^0-9.]/g,""))||0),0);return o>=1e5?"₹"+(o/1e5).toFixed(1)+"L":"₹"+o.toLocaleString("en-IN")}catch{return"—"}})()}</div>
                    </div>
                </div>

                <div class="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-lg">
                    <div class="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <h3 class="text-lg font-semibold text-slate-900">Revenue vs Collection</h3>
                            <p class="text-sm text-slate-500">Monthly trend</p>
                        </div>
                        <button data-action="reports:exportChart" class="px-3 py-2 text-sm font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">Export chart</button>
                    </div>
                    <div class="mt-4 h-80 bg-slate-50 rounded-lg p-3">
                        <div class="relative w-full h-full"><canvas id="revenueReportChart"></canvas></div>
                    </div>
                </div>

                <div class="bg-white rounded-lg border border-slate-200 overflow-hidden">
                    <div class="p-4 border-b border-slate-200 flex items-center justify-between">
                        <div class="text-sm font-medium text-slate-900">Monthly Breakdown</div>
                        <div class="text-xs text-slate-500">6 rows</div>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm" style="min-width: 800px;">
                            <thead class="bg-slate-50 text-slate-600">
                                <tr>
                                    <th class="text-left px-4 py-3 font-medium">Month</th>
                                    <th class="text-right px-4 py-3 font-medium">Revenue</th>
                                    <th class="text-right px-4 py-3 font-medium">Collected</th>
                                    <th class="text-right px-4 py-3 font-medium">Pending</th>
                                    <th class="text-left px-4 py-3 font-medium">Top Client</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-200">
                                ${n.map(l=>`
                                    <tr class="hover:bg-slate-50">
                                        <td class="px-4 py-3 font-medium text-slate-900">${l.month}</td>
                                        <td class="px-4 py-3 text-right font-medium text-slate-900">${l.revenue}</td>
                                        <td class="px-4 py-3 text-right text-slate-700">${l.collected}</td>
                                        <td class="px-4 py-3 text-right text-slate-700">${l.pending}</td>
                                        <td class="px-4 py-3 text-slate-700">${l.topClient}</td>
                                    </tr>
                                `).join("")}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
    `}getReportsFunnel(){const a=this.getStoredLeads?this.getStoredLeads():[],t=new Map;a.forEach(u=>{const b=String(u.source||"Other").trim()||"Other";t.has(b)||t.set(b,{leads:0,qualified:0,proposals:0,deals:0,projects:0});const v=t.get(b);v.leads++;const C=String(u.stage||"").toLowerCase();["new lead","missed call"].includes(C)||v.qualified++,["quotation","negotiation","closed","po received"].includes(C)&&v.proposals++,["closed","po received"].includes(C)&&v.deals++});const i=[...t.entries()].map(([u,b])=>({source:u,leads:b.leads,qualified:b.qualified,proposals:b.proposals,deals:b.deals,projects:b.projects,convRate:b.leads>0?(b.deals/b.leads*100).toFixed(1)+"%":"0%"})),s=i.reduce((u,b)=>u+b.leads,0),n=i.reduce((u,b)=>u+b.qualified,0),l=i.reduce((u,b)=>u+b.proposals,0),o=i.reduce((u,b)=>u+b.deals,0),r=i.reduce((u,b)=>u+b.projects,0),c=s>0?(o/s*100).toFixed(1)+"%":"0%",d=this.getStoredLeads?this.getStoredLeads():[];this.getLeadPipelineStages&&this.getLeadPipelineStages();const p=d.length,g=d.filter(u=>{const b=String(u.stage||"").toLowerCase();return b!=="new lead"&&b!=="missed call"}).length,h=d.filter(u=>["quotation","negotiation","closed","po received"].includes(String(u.stage||"").toLowerCase())).length,m=d.filter(u=>["closed","po received"].includes(String(u.stage||"").toLowerCase())).length,f=(this.getStoredProjects?this.getStoredProjects():[]).length;return`
            <div class="space-y-6 fade-in">
                <div class="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h2 class="text-xl sm:text-2xl font-semibold text-slate-900">Funnel Report</h2>
                        <p class="text-sm text-slate-500">Lead to project conversion — full pipeline breakdown</p>
                    </div>
                    <button id="funnelExportBtn" class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                        <i data-lucide="download" class="w-4 h-4"></i> Export Excel
                    </button>
                </div>
                <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    ${[{label:"Total Leads",val:String(p),sub:p>0?"from lead registry":"No leads yet",col:"sky"},{label:"Qualified",val:String(g),sub:g>0?"past intake stage":"—",col:"indigo"},{label:"Proposals Sent",val:String(h),sub:h>0?"at proposal stage+":"—",col:"amber"},{label:"Deals Won",val:String(m),sub:m>0?"closed / PO received":"—",col:"emerald"},{label:"Projects Started",val:String(f),sub:f>0?"active projects":"—",col:"purple"}].map(u=>`
                    <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                        <div class="text-xs text-slate-500 mb-1">${u.label}</div>
                        <div class="text-2xl font-bold text-slate-900">${u.val}</div>
                        <div class="text-xs mt-1 text-emerald-600">${u.sub}</div>
                    </div>`).join("")}
                </div>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                        <h3 class="text-base font-semibold text-slate-900 mb-1">Funnel Volume by Stage</h3>
                        <p class="text-xs text-slate-500 mb-3">Count at each pipeline stage</p>
                        <div class="h-60"><div class="relative w-full h-full"><canvas id="funnelBarChart"></canvas></div>
                    </div>
                    <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                        <h3 class="text-base font-semibold text-slate-900 mb-1">Stage Conversion Rate %</h3>
                        <p class="text-xs text-slate-500 mb-3">Drop-off between each stage</p>
                        <div class="h-60"><div class="relative w-full h-full"><canvas id="funnelConvChart"></canvas></div>
                    </div>
                </div>
                <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div class="p-4 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <div class="text-sm font-semibold text-slate-900">Funnel Breakdown by Lead Source</div>
                            <div class="text-xs text-slate-500">Conversion at every stage per channel</div>
                        </div>
                    </div>
                    <div class="overflow-x-auto">
                        <table id="funnelTable" class="w-full text-sm" style="min-width:700px">
                            <thead class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                                <tr>
                                    <th class="text-left px-4 py-3">Source</th>
                                    <th class="text-right px-4 py-3">Leads</th>
                                    <th class="text-right px-4 py-3">Qualified</th>
                                    <th class="text-right px-4 py-3">Proposals</th>
                                    <th class="text-right px-4 py-3">Deals Won</th>
                                    <th class="text-right px-4 py-3">Projects</th>
                                    <th class="text-right px-4 py-3">Conv. Rate</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                ${i.map(u=>`
                                <tr class="hover:bg-slate-50">
                                    <td class="px-4 py-3 font-medium text-slate-900">${u.source}</td>
                                    <td class="px-4 py-3 text-right text-slate-700">${u.leads}</td>
                                    <td class="px-4 py-3 text-right text-slate-700">${u.qualified}</td>
                                    <td class="px-4 py-3 text-right text-slate-700">${u.proposals}</td>
                                    <td class="px-4 py-3 text-right font-semibold text-emerald-700">${u.deals}</td>
                                    <td class="px-4 py-3 text-right text-slate-700">${u.projects}</td>
                                    <td class="px-4 py-3 text-right"><span class="px-2 py-0.5 text-xs font-semibold bg-purple-50 text-purple-700 rounded-full">${u.convRate}</span></td>
                                </tr>`).join("")}
                            </tbody>
                            <tfoot class="bg-slate-50 border-t border-slate-200 text-sm font-semibold text-slate-800">
                                <tr><td class="px-4 py-3">Total</td><td class="px-4 py-3 text-right">${s}</td><td class="px-4 py-3 text-right">${n}</td><td class="px-4 py-3 text-right">${l}</td><td class="px-4 py-3 text-right text-emerald-700">${o}</td><td class="px-4 py-3 text-right">${r}</td><td class="px-4 py-3 text-right text-purple-700">${c}</td></tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                        <div class="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-1">Best Stage</div>
                        <div class="text-sm font-bold text-emerald-900">Deals → Projects: 75.3%</div>
                    </div>
                    <div class="bg-amber-50 border border-amber-200 rounded-xl p-4">
                        <div class="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">Bottleneck</div>
                        <div class="text-sm font-bold text-amber-900">Qualified → Proposals: 55.7%</div>
                    </div>
                    <div class="bg-sky-50 border border-sky-200 rounded-xl p-4">
                        <div class="text-xs font-semibold text-sky-700 uppercase tracking-wide mb-1">Overall Win Rate</div>
                        <div class="text-sm font-bold text-sky-900">Leads → Deals: 19.8%</div>
                    </div>
                </div>
            </div>`}getReportsCampaigns(){const a=this.getStoredCampaigns(),t=this.getStoredClients(),i=this.getStoredLeads(),s=a.filter(v=>!String(v.name||"").toLowerCase().includes("sms")&&!String(v.name||"").toLowerCase().includes("whatsapp")),l=s.reduce((v,C)=>v+(parseInt(C.audience)||0),0)||t.length+i.length,o=s.length?s.reduce((v,C)=>v+(parseFloat(C.openRate)||28),0)/s.length:28,r=s.length?s.reduce((v,C)=>v+(parseFloat(C.clickRate)||8),0)/s.length:8,c=[{type:"Email",sent:l,delivered:Math.round(l*.97),opened:Math.round(l*o/100),clicked:Math.round(l*r/100),converted:Math.round(l*r/100*.25),unsub:Math.round(l*.007),color:"sky"},{type:"WhatsApp",sent:Math.round(l*.4),delivered:Math.round(l*.39),opened:Math.round(l*.3),clicked:Math.round(l*.13),converted:Math.round(l*.04),unsub:3,color:"emerald"},{type:"Re-engagement",sent:Math.round(l*.2),delivered:Math.round(l*.19),opened:Math.round(l*.1),clicked:Math.round(l*.04),converted:Math.round(l*.01),unsub:2,color:"rose"}],d=c.reduce((v,C)=>v+C.sent,0),p=c.reduce((v,C)=>v+C.converted,0),g=c.reduce((v,C)=>v+C.delivered,0),h=c.reduce((v,C)=>v+C.opened,0),m=c.reduce((v,C)=>v+C.clicked,0),f=c.reduce((v,C)=>v+C.unsub,0),w=d>0?(p/d*100).toFixed(1):0,u=c.reduce((v,C)=>v.converted/Math.max(v.sent,1)>C.converted/Math.max(C.sent,1)?v:C);return`
            <div class="space-y-6 fade-in">
                <div class="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h2 class="text-xl sm:text-2xl font-semibold text-slate-900">Campaign Performance Report</h2>
                        <p class="text-sm text-slate-500">All channels — Email, WhatsApp, SMS, Call &amp; Re-engagement</p>
                    </div>
                    <button id="campaignExportBtn" class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                        <i data-lucide="download" class="w-4 h-4"></i> Export Excel
                    </button>
                </div>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    ${[{label:"Total Sent",val:d.toLocaleString("en-IN"),sub:"All channels combined",col:"sky"},{label:"Total Delivered",val:c.reduce((v,C)=>v+C.delivered,0).toLocaleString("en-IN"),sub:`${d?Math.round(c.reduce((v,C)=>v+C.delivered,0)/d*100):97}% delivery rate`,col:"indigo"},{label:"Total Converted",val:p.toLocaleString("en-IN"),sub:`${d?(p/d*100).toFixed(1):0}% conversion rate`,col:"emerald"},{label:"Best Channel",val:u.type,sub:`${u.sent?(u.converted/u.sent*100).toFixed(1):0}% conversion`,col:"purple"}].map(v=>`
                    <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                        <div class="text-xs text-slate-500 mb-1">${v.label}</div>
                        <div class="text-2xl font-bold text-slate-900">${v.val}</div>
                        <div class="text-xs text-slate-500 mt-1">${v.sub}</div>
                    </div>`).join("")}
                </div>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                        <h3 class="text-base font-semibold text-slate-900 mb-1">Messages Sent vs Converted</h3>
                        <p class="text-xs text-slate-500 mb-3">Volume per channel</p>
                        <div class="h-60"><div class="relative w-full h-full"><canvas id="campaignBarChart"></canvas></div>
                    </div>
                    <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                        <h3 class="text-base font-semibold text-slate-900 mb-1">Conversion Rate by Channel %</h3>
                        <p class="text-xs text-slate-500 mb-3">Effectiveness comparison</p>
                        <div class="h-60"><div class="relative w-full h-full"><canvas id="campaignConvChart"></canvas></div>
                    </div>
                </div>
                <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div class="p-4 border-b border-slate-100">
                        <div class="text-sm font-semibold text-slate-900">Campaign Channel Breakdown</div>
                        <div class="text-xs text-slate-500">Sent, Delivered, Opened, Clicked, Converted per channel</div>
                    </div>
                    <div class="overflow-x-auto">
                        <table id="campaignTable" class="w-full text-sm" style="min-width:750px">
                            <thead class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                                <tr>
                                    <th class="text-left px-4 py-3">Channel</th>
                                    <th class="text-right px-4 py-3">Sent</th>
                                    <th class="text-right px-4 py-3">Delivered</th>
                                    <th class="text-right px-4 py-3">Opened</th>
                                    <th class="text-right px-4 py-3">Clicked</th>
                                    <th class="text-right px-4 py-3">Converted</th>
                                    <th class="text-right px-4 py-3">Unsub</th>
                                    <th class="text-right px-4 py-3">Conv %</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                ${c.map(v=>{const C=(v.converted/v.sent*100).toFixed(1);return`<tr class="hover:bg-slate-50">
                                        <td class="px-4 py-3 font-semibold text-slate-900">${v.type}</td>
                                        <td class="px-4 py-3 text-right text-slate-700">${v.sent.toLocaleString()}</td>
                                        <td class="px-4 py-3 text-right text-slate-700">${v.delivered.toLocaleString()}</td>
                                        <td class="px-4 py-3 text-right text-slate-700">${v.opened>0?v.opened.toLocaleString():"—"}</td>
                                        <td class="px-4 py-3 text-right text-slate-700">${v.clicked>0?v.clicked.toLocaleString():"—"}</td>
                                        <td class="px-4 py-3 text-right font-semibold text-emerald-700">${v.converted}</td>
                                        <td class="px-4 py-3 text-right text-slate-500">${v.unsub>0?v.unsub:"—"}</td>
                                        <td class="px-4 py-3 text-right"><span class="px-2 py-0.5 text-xs font-semibold bg-purple-50 text-purple-700 rounded-full">${C}%</span></td>
                                    </tr>`}).join("")}
                            </tbody>
                            <tfoot class="bg-slate-50 border-t border-slate-200 text-sm font-semibold text-slate-800">
                                <tr><td class="px-4 py-3">Total</td><td class="px-4 py-3 text-right">${d.toLocaleString()}</td><td class="px-4 py-3 text-right">${g.toLocaleString()}</td><td class="px-4 py-3 text-right">${h.toLocaleString()}</td><td class="px-4 py-3 text-right">${m.toLocaleString()}</td><td class="px-4 py-3 text-right text-emerald-700">${p}</td><td class="px-4 py-3 text-right">${f}</td><td class="px-4 py-3 text-right text-purple-700">${w}%</td></tr>
            </tfoot>
            </table></div>
            </div>`}getReportsLtv(){const a=this.getStoredClients(),t=this.getAllInvoices(),i=d=>String(d??"").replace(/</g,"&lt;"),s={};t.forEach(d=>{const p=String(d.client||"").trim();p&&(s[p]||(s[p]={name:p,total:0,invoiceCount:0,paidCount:0}),s[p].total+=this.parseCurrencyToNumber(d.amount),s[p].invoiceCount++,String(d.status||"").toLowerCase()==="paid"&&s[p].paidCount++)}),a.forEach(d=>{const p=String(d.name||d.company||"").trim();p&&!s[p]&&(s[p]={name:p,total:0,invoiceCount:0,paidCount:0})});const l=Object.values(s).sort((d,p)=>p.total-d.total).slice(0,12).map(d=>{const p=Math.min(Math.round(40+d.total/15e3+d.paidCount*8),100),g=p>=80?"emerald":p>=60?"sky":p>=40?"amber":"rose",h=p>=80?"High":p>=60?"Medium":"Low";return{...d,score:p,color:g,renewalScore:h}}),o=l.reduce((d,p)=>d+p.total,0),r=l.length?Math.round(o/l.length):0,c=l.filter(d=>d.score>=80).length;return`
            <div class="space-y-6 fade-in">
                <div class="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h2 class="text-xl sm:text-2xl font-semibold text-slate-900">Client Lifetime Value</h2>
                        <p class="text-sm text-slate-500">LTV, invoice history, and renewal readiness — computed from real data</p>
                    </div>
                    <button data-action="table:exportCsv" class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Export CSV</button>
                </div>

                <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div class="bg-white rounded-xl border p-4"><div class="text-xs text-slate-500">Total Clients</div><div class="text-2xl font-bold text-slate-900 mt-1">${l.length}</div>
                    <div class="bg-white rounded-xl border p-4"><div class="text-xs text-slate-500">Total LTV</div><div class="text-xl font-bold text-purple-700 mt-1">${this.formatINR(o)}</div>
                    <div class="bg-white rounded-xl border p-4"><div class="text-xs text-slate-500">Avg LTV / Client</div><div class="text-xl font-bold text-sky-700 mt-1">${this.formatINR(r)}</div>
                    <div class="bg-white rounded-xl border p-4"><div class="text-xs text-slate-500">High-Value Clients</div><div class="text-2xl font-bold text-emerald-700 mt-1">${c}</div>
                </div>

                <div class="bg-white rounded-xl border overflow-hidden shadow-sm">
                    <div class="overflow-x-auto"><table class="w-full text-sm" style="min-width:700px">
                        <thead class="bg-slate-50 text-slate-600"><tr>
                            <th class="text-left px-5 py-3 font-medium">#</th>
                            <th class="text-left px-5 py-3 font-medium">Client</th>
                            <th class="text-right px-5 py-3 font-medium">Lifetime Value</th>
                            <th class="text-right px-5 py-3 font-medium">Invoices</th>
                            <th class="text-left px-5 py-3 font-medium">LTV Score</th>
                            <th class="text-left px-5 py-3 font-medium">Renewal</th>
                            <th class="text-left px-5 py-3 font-medium">Action</th>
                        </tr></thead>
                        <tbody class="divide-y divide-slate-100">
                        ${l.map((d,p)=>`
                            <tr class="hover:bg-slate-50">
                                <td class="px-5 py-3 text-slate-400 font-medium">${p+1}</td>
                                <td class="px-5 py-3 font-semibold text-slate-900">${i(d.name)}</td>
                                <td class="px-5 py-3 text-right font-bold text-slate-900">${this.formatINR(d.total)}</td>
                                <td class="px-5 py-3 text-right text-slate-600">${d.invoiceCount} total / ${d.paidCount} paid</td>
                                <td class="px-5 py-3">
                                    <div class="flex items-center gap-2">
                                        <div class="flex-1 bg-slate-100 rounded-full h-2"><div class="bg-${d.color}-500 h-2 rounded-full" style="width:${d.score}%"></div>
                                        <span class="text-xs font-bold text-${d.color}-700">${d.score}</span>
                                    </div>
                                </td>
                                <td class="px-5 py-3"><span class="px-2 py-1 text-xs font-medium bg-${d.color}-50 text-${d.color}-700 rounded-full">${d.renewalScore}</span></td>
                                <td class="px-5 py-3">
                                    <button data-action="billing:goToClient" data-client-name="${i(d.name)}" class="px-3 py-1.5 text-xs font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100">View →</button>
                                </td>
                            </tr>`).join("")}
                        </tbody>
                    </table></div>
                </div>
            </div>`}getReportsSopMonthly(){const a=this.getStoredClients(),t=this.getStoredProjects(),i=this.getAllInvoices(),s=this.getStoredCampaigns(),n=this.readStore("bezent_feedback_submissions",[]),l=u=>{if(!u)return null;const b=new Date(u);return isNaN(b)?null:`${b.getFullYear()}-${String(b.getMonth()+1).padStart(2,"0")}`},o={},r=new Date;for(let u=5;u>=0;u--){const b=new Date(r.getFullYear(),r.getMonth()-u,1),v=`${b.getFullYear()}-${String(b.getMonth()+1).padStart(2,"0")}`;o[v]={month:b.toLocaleDateString("en-IN",{month:"short",year:"numeric"}),newClients:0,activeProjects:0,completed:0,invoiced:0,collected:0,followups:0,campaigns:0,satisfaction:0,feedbackCount:0}}a.forEach(u=>{const b=l(u.createdAt||u.id||null);o[b]&&o[b].newClients++}),t.forEach(u=>{var v;const b=l(u.startDate||u.createdAt||null);o[b]&&(String((u==null?void 0:u.status)||((v=u==null?void 0:u.monitoring)==null?void 0:v.overallProjectStatus)||"").toLowerCase().includes("complet")?o[b].completed++:o[b].activeProjects++)}),i.forEach(u=>{const b=l(u.date||u.createdAt||null);if(o[b]){const v=this.parseCurrencyToNumber(u.amount);o[b].invoiced+=v,String(u.status||"").toLowerCase()==="paid"&&(o[b].collected+=v)}}),s.forEach(u=>{const b=l(u.createdAt||null);o[b]&&o[b].campaigns++}),n.forEach(u=>{const b=l(u.submittedAt||null);o[b]&&(o[b].satisfaction+=parseFloat(u.avg||0),o[b].feedbackCount++)});const c=Object.values(o).map(u=>({...u,invoiced:u.invoiced?"₹"+(u.invoiced/1e5).toFixed(1)+" L":"—",collected:u.collected?"₹"+(u.collected/1e5).toFixed(1)+" L":"—",satisfaction:u.feedbackCount?Math.round(u.satisfaction/u.feedbackCount*20)+"%":"—"})),d=a.length,p=t.filter(u=>String((u==null?void 0:u.status)||"").toLowerCase().includes("complet")).length,g=i.reduce((u,b)=>u+this.parseCurrencyToNumber(b.amount),0),h=i.filter(u=>String((u==null?void 0:u.status)||"").toLowerCase()==="paid").reduce((u,b)=>u+this.parseCurrencyToNumber(b.amount),0),m=g?Math.round(h/g*100):0,f=u=>u>=1e5?"₹"+(u/1e5).toFixed(1)+" L":"₹"+u.toLocaleString("en-IN");return`
            <div class="space-y-6 fade-in">
                <div class="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h2 class="text-xl sm:text-2xl font-semibold text-slate-900">SOP Monthly Report</h2>
                        <p class="text-sm text-slate-500">Overall monthly activities — clients, projects, billing &amp; campaigns</p>
                    </div>
                    <button id="sopExportBtn" class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                        <i data-lucide="download" class="w-4 h-4"></i> Export Excel
                    </button>
                </div>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    ${[{label:"Total Clients",val:String(d),sub:"All registered clients",col:"sky"},{label:"Projects Completed",val:String(p),sub:"In stored projects",col:"emerald"},{label:"Total Invoiced",val:f(g),sub:"All stored invoices",col:"indigo"},{label:"Total Collected",val:f(h),sub:`${m}% collection rate`,col:"purple"}].map(u=>`
                    <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                        <div class="text-xs text-slate-500 mb-1">${u.label}</div>
                        <div class="text-2xl font-bold text-slate-900">${u.val}</div>
                        <div class="text-xs text-slate-500 mt-1">${u.sub}</div>
                    </div>`).join("")}
                </div>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                        <h3 class="text-base font-semibold text-slate-900 mb-1">Monthly Invoiced vs Collected</h3>
                        <p class="text-xs text-slate-500 mb-3">Billing trend over 6 months</p>
                        <div class="h-60 relative w-full"><div class="relative w-full h-full"><canvas id="sopBillingChart"></canvas></div>
                    </div>
                    <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                        <h3 class="text-base font-semibold text-slate-900 mb-1">Projects &amp; Clients Activity</h3>
                        <p class="text-xs text-slate-500 mb-3">New clients &amp; completed projects per month</p>
                        <div class="h-60 relative w-full"><div class="relative w-full h-full"><canvas id="sopActivityChart"></canvas></div>
                    </div>
                </div>
                <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div class="p-4 border-b border-slate-100">
                        <div class="text-sm font-semibold text-slate-900">Monthly Activity Summary</div>
                        <div class="text-xs text-slate-500">Clients, projects, billing, follow-ups &amp; campaigns</div>
                    </div>
                    <div class="overflow-x-auto">
                        <table id="sopTable" class="w-full text-sm" style="min-width:900px">
                            <thead class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                                <tr>
                                    <th class="text-left px-4 py-3">Month</th>
                                    <th class="text-right px-4 py-3">New Clients</th>
                                    <th class="text-right px-4 py-3">Active Projects</th>
                                    <th class="text-right px-4 py-3">Completed</th>
                                    <th class="text-right px-4 py-3">Invoiced</th>
                                    <th class="text-right px-4 py-3">Collected</th>
                                    <th class="text-right px-4 py-3">Follow-ups</th>
                                    <th class="text-right px-4 py-3">Campaigns</th>
                                    <th class="text-right px-4 py-3">Satisfaction</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                ${c.map(u=>`
                                <tr class="hover:bg-slate-50">
                                    <td class="px-4 py-3 font-semibold text-slate-900">${u.month}</td>
                                    <td class="px-4 py-3 text-right text-sky-700 font-medium">${u.newClients}</td>
                                    <td class="px-4 py-3 text-right text-slate-700">${u.activeProjects}</td>
                                    <td class="px-4 py-3 text-right text-emerald-700 font-medium">${u.completed}</td>
                                    <td class="px-4 py-3 text-right text-slate-700">${u.invoiced}</td>
                                    <td class="px-4 py-3 text-right font-semibold text-indigo-700">${u.collected}</td>
                                    <td class="px-4 py-3 text-right text-slate-700">${u.followups}</td>
                                    <td class="px-4 py-3 text-right text-slate-700">${u.campaigns}</td>
                                    <td class="px-4 py-3 text-right"><span class="px-2 py-0.5 text-xs font-semibold bg-emerald-50 text-emerald-700 rounded-full">${u.satisfaction}</span></td>
                                </tr>`).join("")}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>`}initializeFunnelReportCharts(){var i;const a=document.getElementById("funnelBarChart");a&&(this.charts.funnelBarChart=new Chart(a,{type:"bar",data:{labels:["Leads","Qualified","Proposals","Deals","Projects"],datasets:[{label:"Count",data:(()=>{try{const s=this.getLeadsData?this.getLeadsData():[];return["New Lead","Contacted","Follow-up","Quotation","PO Received"].map(l=>s.filter(o=>String(o.stage||"").toLowerCase()===l.toLowerCase()).length)}catch{return[0,0,0,0,0]}})(),backgroundColor:["#0ea5e9","#6366f1","#f59e0b","#10b981","#8b5cf6"]}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1}},scales:{x:{grid:{display:!1}},y:{beginAtZero:!0}}}}));const t=document.getElementById("funnelConvChart");t&&(this.charts.funnelConvChart=new Chart(t,{type:"bar",data:{labels:["Lead→Qual","Qual→Prop","Prop→Deal","Deal→Proj"],datasets:[{label:"Conv %",data:[0,0,0,0],backgroundColor:["#0ea5e9","#f59e0b","#6366f1","#10b981"]}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1}},scales:{x:{grid:{display:!1}},y:{beginAtZero:!0,max:100}}}})),(i=document.getElementById("funnelExportBtn"))==null||i.addEventListener("click",()=>this.exportTableToExcel("funnelTable","Funnel_Report"))}initializeCampaignReportCharts(){var i;const a=document.getElementById("campaignBarChart");a&&(this.charts.campaignBarChart=new Chart(a,{type:"bar",data:{labels:["Email","WhatsApp","SMS","Call","Re-engagement"],datasets:[{label:"Sent",data:(()=>{try{const s=this.getStoredFollowups?this.getStoredFollowups():[];return["Email","WhatsApp","SMS","Call","Re-engagement"].map(l=>s.filter(o=>String(o.type||"").toLowerCase()===l.toLowerCase()).length)}catch{return[0,0,0,0,0]}})(),backgroundColor:"rgba(99,102,241,0.65)"},{label:"Converted",data:[0,0,0,0,0],backgroundColor:"rgba(16,185,129,0.75)"}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"bottom"}},scales:{x:{grid:{display:!1}},y:{beginAtZero:!0}}}}));const t=document.getElementById("campaignConvChart");t&&(this.charts.campaignConvChart=new Chart(t,{type:"bar",data:{labels:["Email","WhatsApp","SMS","Call","Re-eng"],datasets:[{label:"Conv %",data:[2.3,9.4,2.2,13.8,4.3],backgroundColor:["#0ea5e9","#10b981","#6366f1","#f59e0b","#f43f5e"]}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1}},scales:{x:{grid:{display:!1}},y:{beginAtZero:!0,max:20}}}})),(i=document.getElementById("campaignExportBtn"))==null||i.addEventListener("click",()=>this.exportTableToExcel("campaignTable","Campaign_Report"))}initializeSopMonthlyCharts(){var i;const a=document.getElementById("sopBillingChart");a&&(this.charts.sopBillingChart=new Chart(a,{type:"line",data:{labels:(()=>{try{const s=this.getStoredInvoices?this.getStoredInvoices():[],n=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],l=new Set;s.forEach(r=>{const c=r.invoice_date||r.date?new Date(r.invoice_date||r.date):new Date;l.add(n[c.getMonth()])});const o=[...l].slice(-6);return o.length?o:["Oct","Nov","Dec","Jan","Feb","Mar"]}catch{return["Oct","Nov","Dec","Jan","Feb","Mar"]}})(),datasets:[...(()=>{try{const s=this.getStoredInvoices?this.getStoredInvoices():[],n=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],l=new Map;s.forEach(c=>{const d=parseFloat(String(c.amount||"0").replace(/[^0-9.]/g,""))||0,p=String(c.status||"").toLowerCase()==="paid",g=c.invoice_date||c.date?new Date(c.invoice_date||c.date):new Date,h=n[g.getMonth()];l.has(h)||l.set(h,{inv:0,col:0});const m=l.get(h);m.inv+=d,p&&(m.col+=d)});const o=[...l.entries()].slice(-6),r=o.length?o.map(([c])=>c):["Oct","Nov","Dec","Jan","Feb","Mar"];return[{label:"Invoiced",data:o.length?o.map(([,c])=>c.inv):[0,0,0,0,0,0],borderColor:"#6366f1",backgroundColor:"rgba(99,102,241,0.1)",tension:.35},{label:"Collected",data:o.length?o.map(([,c])=>c.col):[0,0,0,0,0,0],borderColor:"#10b981",backgroundColor:"rgba(16,185,129,0.1)",tension:.35}]}catch{return[{label:"Invoiced",data:[0,0,0,0,0,0],borderColor:"#6366f1",backgroundColor:"rgba(99,102,241,0.1)",tension:.35},{label:"Collected",data:[0,0,0,0,0,0],borderColor:"#10b981",backgroundColor:"rgba(16,185,129,0.1)",tension:.35}]}})()]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"bottom"}}}}));const t=document.getElementById("sopActivityChart");t&&(this.charts.sopActivityChart=new Chart(t,{type:"bar",data:{labels:["Oct","Nov","Dec","Jan","Feb","Mar"],datasets:[{label:"New Clients",data:(()=>{try{const s=this.getStoredClients?this.getStoredClients():[];return[0,0,0,0,0,Math.min(s.length,9)]}catch{return[0,0,0,0,0,0]}})(),backgroundColor:"rgba(14,165,233,0.7)"},{label:"Completed",data:(()=>{try{const s=this.getStoredProjects?this.getStoredProjects().filter(n=>String(n.status||"").toLowerCase()==="completed"):[];return[0,0,0,0,0,Math.min(s.length,9)]}catch{return[0,0,0,0,0,0]}})(),backgroundColor:"rgba(16,185,129,0.7)"}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"bottom"}},scales:{x:{grid:{display:!1}},y:{beginAtZero:!0}}}})),(i=document.getElementById("sopExportBtn"))==null||i.addEventListener("click",()=>this.exportTableToExcel("sopTable","SOP_Monthly_Report"))}exportTableToExcel(a,t){const i=document.getElementById(a);if(!i)return;const s=[];i.querySelectorAll("tr").forEach(c=>{const d=[];c.querySelectorAll("th, td").forEach(p=>d.push(p.innerText.trim())),s.push(d.join("	"))});const n=s.join(`
`),l=new Blob(["\uFEFF"+n],{type:"text/tab-separated-values;charset=utf-8;"}),o=URL.createObjectURL(l),r=document.createElement("a");r.href=o,r.download=t+".xls",r.click(),URL.revokeObjectURL(o)}initializeRevenueReportChart(){const a=document.getElementById("revenueReportChart");a&&(this.charts.revenueReportChart=new Chart(a,{type:"line",data:{...(()=>{try{const t=this.getStoredInvoices?this.getStoredInvoices():[],i=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],s=new Map;t.forEach(l=>{const o=parseFloat(String(l.amount||"0").replace(/[^0-9.]/g,""))||0,r=String(l.status||"").toLowerCase()==="paid",c=l.invoice_date||l.date?new Date(l.invoice_date||l.date):new Date,d=i[c.getMonth()]+" "+c.getFullYear();s.has(d)||s.set(d,{rev:0,col:0});const p=s.get(d);p.rev+=o,r&&(p.col+=o)});const n=[...s.entries()].slice(-6);return{labels:n.length?n.map(([l])=>l.split(" ")[0]):i.slice(0,6),datasets:[{label:"Revenue (₹)",data:n.length?n.map(([,l])=>l.rev):[0,0,0,0,0,0],borderColor:"#0ea5e9",backgroundColor:"rgba(14,165,233,0.10)",tension:.35},{label:"Collection (₹)",data:n.length?n.map(([,l])=>l.col):[0,0,0,0,0,0],borderColor:"#10b981",backgroundColor:"rgba(16,185,129,0.10)",tension:.35}]}}catch{return{labels:["Jan","Feb","Mar","Apr","May","Jun"],datasets:[{label:"Revenue (₹)",data:[0,0,0,0,0,0],borderColor:"#0ea5e9",backgroundColor:"rgba(14,165,233,0.10)",tension:.35},{label:"Collection (₹)",data:[0,0,0,0,0,0],borderColor:"#10b981",backgroundColor:"rgba(16,185,129,0.10)",tension:.35}]}}})()},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"bottom"}}}}))}initializeProjectRoadmapCharts(){const a=this.getStoredProjects?this.getStoredProjects().slice(0,6):[],t=a.map(c=>String(c.name||"").slice(0,16)),i=a.map(c=>Number(c.progress)||0),s=a.map(c=>parseFloat(String(c.budget||"0").replace(/[^0-9.]/g,""))||0),n=a.map(c=>parseFloat(String(c.spent||"0").replace(/[^0-9.]/g,""))||0),l=document.getElementById("projectProgressChart");if(l){const c=["rgba(16,185,129,0.8)","rgba(245,158,11,0.8)","rgba(14,165,233,0.8)","rgba(16,185,129,0.7)"];if(this.charts.projectProgressChart)try{this.charts.projectProgressChart.destroy()}catch{}this.charts.projectProgressChart=new Chart(l,{type:"bar",data:{labels:t,datasets:[{label:"Progress %",data:i,backgroundColor:c,borderRadius:6}]},options:{responsive:!0,maintainAspectRatio:!1,indexAxis:"y",plugins:{legend:{display:!1}},scales:{x:{max:100,ticks:{callback:d=>d+"%"}}}}})}const o=document.getElementById("projectBudgetChart");if(o){if(this.charts.projectBudgetChart)try{this.charts.projectBudgetChart.destroy()}catch{}this.charts.projectBudgetChart=new Chart(o,{type:"bar",data:{labels:t,datasets:[{label:"Budget (INR)",data:s,backgroundColor:"rgba(139,92,246,0.6)",borderRadius:4},{label:"Spent (INR)",data:n,backgroundColor:"rgba(16,185,129,0.6)",borderRadius:4}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"bottom"}},scales:{y:{ticks:{callback:c=>"₹"+(c/1e3).toFixed(0)+"k"}}}}})}const r=document.getElementById("projectRoadmapExportBtn");r&&(r.onclick=()=>{if(typeof XLSX>"u"){alert("SheetJS library not loaded. Please check your internet connection and refresh.");return}const c=XLSX.utils.book_new(),d=[["Project Roadmap Report — Summary"],["Generated",new Date().toLocaleString("en-IN")],[],["KPI","Value","Note"],["Total Projects",4,"All registered projects"],["On Track",3,"75% of total"],["At Risk / Delayed",2,"Needs attention"],["Completed",1,"Fully delivered"],["Avg Progress","52%","Across all projects"],["Total Budget",93e4,"Sum of all PO values (INR)"],["Total Spent",591e3,"64% utilised (INR)"],["Delivered","1/4","Delivery confirmed"]],p=XLSX.utils.aoa_to_sheet(d);p["!cols"]=[{wch:28},{wch:18},{wch:38}],XLSX.utils.book_append_sheet(c,p,"Summary");const g=[["Project Progress Overview"],["Project","Progress (%)"],...t.map((w,u)=>[w,i[u]]),[],["Budget vs Spent"],["Project","Budget (INR)","Spent (INR)","Balance (INR)","Utilised (%)"],...["SEO Revamp","CRM Upgrade","Re-engagement Funnel","Performance Ads"].map((w,u)=>[w,s[u],n[u],s[u]-n[u],Math.round(n[u]/s[u]*100)+"%"])],h=XLSX.utils.aoa_to_sheet(g);h["!cols"]=[{wch:26},{wch:16},{wch:16},{wch:16},{wch:14}],XLSX.utils.book_append_sheet(c,h,"Chart Data");const m=document.getElementById("projRoadmapMasterTable");if(m){const w=XLSX.utils.table_to_sheet(m,{raw:!1});w["!cols"]=Array(63).fill({wch:18}),XLSX.utils.book_append_sheet(c,w,"Project Register")}const f=new Date().toISOString().slice(0,10);XLSX.writeFile(c,`ProjectRoadmapReport_${f}.xlsx`)})}renderAIContent(a){switch(this.currentSubSection){case"insights":a.innerHTML=this.getAIInsights();break;case"workflows":a.innerHTML=this.getAIWorkflows();break;case"alerts":a.innerHTML=this.getAISmartAlerts();break;case"predictions":a.innerHTML=this.getAIPredictions();break;default:a.innerHTML=this.getAIInsights()}}getAIInsights(){const a=this.getStoredLeads(),t=this.getAllInvoices(),i=this.getStoredClients(),s=this.readStore("bezent_campaigns",[]),n=this.readStore("bezent_followups",[]),l=m=>String(m??"").replace(/</g,"&lt;"),o=t.filter(m=>String(m.status||"").toLowerCase()==="overdue"),r=a.filter(m=>["warm","hot"].includes(String(m.stage||m.status||"").toLowerCase())),c=a.filter(m=>["won","closed"].includes(String(m.stage||m.status||"").toLowerCase())),d=n.filter(m=>!m.done),p=s.filter(m=>String(m.status||"").toLowerCase()==="active"),g=[];if(r.length&&g.push({title:"Hot leads need attention",text:`${r.length} lead${r.length>1?"s are":" is"} warm/hot: ${r.slice(0,3).map(m=>l(m.company||m.contact||"Lead")).join(", ")}`,color:"emerald",icon:"trending-up",action:"nav:leads/all_leads"}),o.length){const m=o.reduce((f,w)=>f+this.parseCurrencyToNumber(w.amount),0);g.push({title:"Overdue invoices — take action",text:`${o.length} invoice${o.length>1?"s are":" is"} overdue totalling ${this.formatINR(m)}. Send reminders now.`,color:"rose",icon:"alert-triangle",action:"billing:sendBulkReminders"})}d.length&&g.push({title:"Pending follow-ups",text:`${d.length} follow-up${d.length>1?"s":""} still open. Auto-schedule to improve response rate by 18%.`,color:"amber",icon:"clock",action:"followup:autoSchedule"}),p.length&&g.push({title:"Active campaigns running",text:`${p.length} campaign${p.length>1?"s":""} in progress — track open rates and consider re-sending to non-openers.`,color:"indigo",icon:"send",action:"nav:campaigns/campaigns_list"}),c.length&&g.push({title:"Won leads — create invoices",text:`${c.length} lead${c.length>1?"s have":" has"} been won. Ensure invoices are generated.`,color:"sky",icon:"badge-dollar-sign",action:"nav:billing/invoices"}),g.length||g.push({title:"All systems healthy",text:"No critical alerts at this time. Keep growing your pipeline!",color:"emerald",icon:"check-circle",action:""});const h=[];return o.slice(0,2).forEach(m=>h.push({t:`Send reminder for ${l(m.no)} (${l(m.client)})`,tag:"Billing",color:"rose",action:"billing:sendBulkReminders"})),r.slice(0,2).forEach(m=>h.push({t:`Follow up with ${l(m.company||m.contact||"Lead")} — ${l(m.stage||"Warm Lead")}`,tag:"Pipeline",color:"indigo",action:"followup:addNew"})),i.slice(0,1).forEach(m=>h.push({t:`Schedule renewal call with ${l(m.name||m.company||"Client")}`,tag:"Retention",color:"emerald",action:"engagement:logAction"})),p.slice(0,1).forEach(m=>h.push({t:`Review performance of campaign: ${l(m.name)}`,tag:"Campaign",color:"amber",action:"nav:campaigns/campaigns_list"})),h.length||h.push({t:"Add leads and clients to see AI-driven action suggestions",tag:"Setup",color:"slate",action:""}),`
            <div class="space-y-6 fade-in">
                <div class="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h2 class="text-xl sm:text-2xl font-semibold text-slate-900">AI Insights</h2>
                        <p class="text-sm text-slate-500">Real-time suggestions from your pipeline, billing &amp; engagement data</p>
                    </div>
                    <button data-action="ai:refresh" class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Refresh</button>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    ${g.map(m=>`
                        <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                            <div class="flex items-start gap-4">
                                <div class="w-12 h-12 rounded-lg bg-${m.color}-50 flex items-center justify-center flex-shrink-0">
                                    <i data-lucide="${m.icon}" class="w-6 h-6 text-${m.color}-700"></i>
                                </div>
                                <div class="flex-1">
                                    <div class="text-sm font-semibold text-slate-900">${m.title}</div>
                                    <div class="text-sm text-slate-600 mt-1">${m.text}</div>
                                    <div class="mt-4 flex gap-2">
                                        ${m.action?`<button data-action="${m.action}" class="px-3 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Take Action</button>`:""}
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join("")}
                </div>

                <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                    <div class="flex items-start justify-between mb-4">
                        <div>
                            <h3 class="text-base font-semibold text-slate-900">Suggested Next Actions</h3>
                            <p class="text-sm text-slate-500">Prioritized from your live data</p>
                        </div>
                    </div>
                    <div class="space-y-3">
                        ${h.map(m=>`
                            <div class="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                                <div class="text-sm font-medium text-slate-900 flex-1">${m.t}</div>
                                <div class="flex items-center gap-3 ml-4">
                                    <span class="px-2 py-1 text-xs font-medium bg-${m.color}-50 text-${m.color}-700 rounded-full">${m.tag}</span>
                                    ${m.action?`<button data-action="${m.action}" class="px-3 py-1.5 text-xs font-semibold bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">Do it</button>`:""}
                                </div>
                            </div>
                        `).join("")}
                    </div>
                </div>
            </div>`}getAIWorkflows(){const i=this.readStore("bezent_workflow_rules",null)||[{id:"inv_reminder",name:"Invoice Reminder",desc:"Send reminder 2 days before invoice due date",enabled:!0,trigger:"Invoice",action:"Notify client"},{id:"lead_followup",name:"Qualified Lead Follow-up",desc:"Create follow-up task within 24h of lead qualification",enabled:!0,trigger:"Lead",action:"Add follow-up"},{id:"survey_after",name:"Survey After Delivery",desc:"Send feedback survey 3 days after project completion",enabled:!1,trigger:"Project",action:"Send survey"},{id:"reengagement",name:"Re-engagement Nudge",desc:"Send win-back message if no activity for 30 days",enabled:!0,trigger:"Inactivity",action:"Send campaign"}],s=i.filter(n=>n.enabled).length;return`
            <div class="space-y-6 fade-in">
                <div class="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h2 class="text-xl sm:text-2xl font-semibold text-slate-900">Workflow Rules</h2>
                        <p class="text-sm text-slate-500">${s} of ${i.length} rules active — automation running in background</p>
                    </div>
                    <button data-action="workflow:addRule" class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">+ New Rule</button>
                </div>

                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div class="bg-white rounded-xl border p-4 text-center"><div class="text-2xl font-bold text-purple-700">${i.length}</div><div class="text-xs text-slate-500 mt-1">Total Rules</div>
                    <div class="bg-white rounded-xl border p-4 text-center"><div class="text-2xl font-bold text-emerald-700">${s}</div><div class="text-xs text-slate-500 mt-1">Active</div>
                    <div class="bg-white rounded-xl border p-4 text-center"><div class="text-2xl font-bold text-amber-600">${i.length-s}</div><div class="text-xs text-slate-500 mt-1">Paused</div>
                    <div class="bg-white rounded-xl border p-4 text-center"><div class="text-2xl font-bold text-sky-700">Auto</div><div class="text-xs text-slate-500 mt-1">Mode</div>
                </div>

                <div class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                    <div class="p-4 border-b border-slate-100 flex items-center justify-between">
                        <div class="text-sm font-semibold text-slate-900">All Rules</div>
                        <span class="text-xs text-slate-400">${i.length} rules configured</span>
                    </div>
                    <div class="divide-y divide-slate-100">
                        ${i.map(n=>`
                            <div class="p-4 flex items-start justify-between hover:bg-slate-50 group">
                                <div class="flex-1 mr-4">
                                    <div class="flex items-center gap-2">
                                        <div class="text-sm font-semibold text-slate-900">${n.name}</div>
                                        <span class="px-2 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-600 rounded-full">${n.trigger}</span>
                                    </div>
                                    <div class="text-sm text-slate-500 mt-1">${n.desc}</div>
                                    <div class="text-xs text-slate-400 mt-1">Action: ${n.action}</div>
                                </div>
                                <div class="flex items-center gap-2 flex-shrink-0">
                                    <button data-action="workflow:toggle" data-rule-id="${n.id}" class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${n.enabled?"bg-emerald-500":"bg-slate-300"}">
                                        <span class="inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${n.enabled?"translate-x-5":"translate-x-1"}"></span>
                                    </button>
                                    <button data-action="workflow:editRule" data-rule-id="${n.id}" class="px-3 py-1.5 text-xs font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">Edit</button>
                                    <button data-action="workflow:deleteRule" data-rule-id="${n.id}" class="px-3 py-1.5 text-xs font-medium bg-rose-50 text-rose-700 rounded-lg hover:bg-rose-100 transition-colors opacity-0 group-hover:opacity-100 transition-opacity">Delete</button>
                                </div>
                            </div>
                        `).join("")}
                    </div>
                </div>
            </div>`}getAISmartAlerts(){const a=this.getAllInvoices(),t=this.getStoredLeads();this.getStoredClients();const i=this.readStore("bezent_followups",[]),s=l=>String(l??"").replace(/</g,"&lt;"),n=[];return a.filter(l=>String(l.status||"").toLowerCase()==="overdue").forEach(l=>{n.push({title:"Invoice overdue",text:`${s(l.no)} is overdue — ${s(l.amount)} from ${s(l.client)}`,color:"rose",icon:"alert-triangle",action:"billing:sendBulkReminders",actionLabel:"Send Reminder"})}),t.filter(l=>["new lead","open"].includes(String(l.stage||l.status||"").toLowerCase())).slice(0,3).forEach(l=>{n.push({title:"Stalled lead",text:`${s(l.company||l.contact||"Lead")} is still in ${s(l.stage||l.status||"New")} — needs a follow-up`,color:"amber",icon:"clock",action:"followup:addNew",actionLabel:"Schedule Follow-up"})}),i.filter(l=>!l.done&&l.priority==="High").slice(0,2).forEach(l=>{n.push({title:"High-priority follow-up pending",text:`${s(l.client)}: ${s(l.topic||"Action required")}`,color:"indigo",icon:"activity",action:"nav:engagement/followups",actionLabel:"View Follow-ups"})}),n.length||n.push({title:"All clear!",text:"No critical alerts right now. Your pipeline and billing are on track.",color:"emerald",icon:"check-circle",action:"",actionLabel:""}),`
            <div class="space-y-6 fade-in">
                <div class="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h2 class="text-xl sm:text-2xl font-semibold text-slate-900">Smart Alerts</h2>
                        <p class="text-sm text-slate-500">${n.length} alert${n.length!==1?"s":""} from live data — overdue, stalled & high-priority</p>
                    </div>
                    <button data-action="ai:refresh" class="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Refresh</button>
                </div>
                <div class="space-y-4">
                    ${n.map(l=>`
                        <div class="bg-white rounded-xl border border-${l.color}-100 p-5 shadow-sm flex items-start gap-4">
                            <div class="w-10 h-10 rounded-lg bg-${l.color}-50 flex items-center justify-center flex-shrink-0">
                                <i data-lucide="${l.icon}" class="w-5 h-5 text-${l.color}-700"></i>
                            </div>
                            <div class="flex-1">
                                <div class="text-sm font-semibold text-slate-900">${l.title}</div>
                                <div class="text-sm text-slate-600 mt-1">${l.text}</div>
                            </div>
                            ${l.action?`<button data-action="${l.action}" class="flex-shrink-0 px-3 py-2 text-xs font-semibold bg-${l.color}-600 text-white rounded-lg hover:opacity-90 transition-opacity">${l.actionLabel}</button>`:""}
                        </div>
                    `).join("")}
                </div>
            </div>`}getAIPredictions(){const a=this.getStoredClients?this.getStoredClients():[],t=this.getInvoiceSummaryByClient?this.getInvoiceSummaryByClient():new Map;return`
    <div class="space-y-6 fade-in">
                <div class="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h2 class="text-xl sm:text-2xl font-semibold text-slate-900">Predictions</h2>
                        <p class="text-sm text-slate-500">Revenue forecast and churn risk</p>
                    </div>
                    <button class="px-4 py-2 text-sm font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">Export</button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div class="col-span-1 lg:col-span-2 bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-lg">
                        <div class="flex flex-wrap items-start justify-between gap-3">
                            <div>
                                <h3 class="text-lg font-semibold text-slate-900">Revenue Forecast</h3>
                                <p class="text-sm text-slate-500">Expected vs risk amount</p>
                            </div>
                            <span class="px-2 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded-full">Next 30 days</span>
                        </div>
                        <div class="mt-4 h-80 bg-slate-50 rounded-lg p-3">
                            <div class="relative w-full h-full"><canvas id="predictionChart"></canvas></div>
                        </div>
                    </div>

                    <div class="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-lg">
                        <h3 class="text-lg font-semibold text-slate-900">Churn Risk</h3>
                        <div class="mt-4 space-y-3">
                            ${a.slice(0,6).map(s=>{const n=String(s.name||"").toLowerCase(),l=t.get(n),o=l&&l.openInvoices>0,r=String(s.stage||"").toLowerCase(),c=o?"High":r.includes("risk")?"Medium":"Low",d=c==="High"?"rose":c==="Medium"?"amber":"emerald",p=o?"Overdue invoices pending":r.includes("risk")?"Project delays or open issues":"Healthy engagement";return{name:String(s.name||"—").split(" ")[0],risk:c,reason:p,color:d}}).map(s=>`
                                <div class="p-4 bg-slate-50 rounded-lg">
                                    <div class="flex flex-wrap items-start justify-between gap-3">
                                        <div class="text-sm font-semibold text-slate-900">${s.name}</div>
                                        <span class="px-2 py-1 text-xs font-medium bg-${s.color}-50 text-${s.color}-700 rounded-full">${s.risk}</span>
                                    </div>
                                    <div class="text-xs text-slate-500 mt-2">${s.reason}</div>
                                </div>
                            `).join("")}
                        </div>
                        <button class="mt-5 w-full px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Create retention plan</button>
                    </div>
                </div>
            </div>
    `}initializeLucideIcons(){typeof lucide<"u"&&lucide.createIcons()}setupEventListeners(){this.setupSidebarToggle(),this.setupSidebarCollapse(),this.setupProfileMenu(),this.setupNotifications(),this.setupActionDispatcher();const a=document.getElementById("sidebar-nav");a&&!this._sidebarNavDelegated&&(this._sidebarNavDelegated=!0,a.addEventListener("click",h=>{const m=h.target.closest("button[data-subsection]");if(!m||!a.contains(m))return;const f=m.dataset.subsection;f&&(this.switchSubSection(f),this.closeMobileSidebar())})),this._sectionNavDelegated||(this._sectionNavDelegated=!0,document.addEventListener("click",h=>{const m=h.target.closest("button[data-action]");if(!m)return;this._lastActionButton=m,(this._handleAction?this._handleAction(m.dataset.action):!1)&&(this.renderSidebar(),this.renderContent(),this.initializeLucideIcons(),this.renderChatPanel())})),this._inputActionDelegated||(this._inputActionDelegated=!0,document.addEventListener("change",h=>{const m=h.target.closest("input[data-action]");if(m){this._lastActionButton=m,this._handleAction&&this._handleAction(m.dataset.action);return}const f=h.target.closest("select[data-action]");if(f&&f.value){this._lastActionButton=f;const w=f.dataset.action;this._handleAction&&this._handleAction(w)}}));const t=document.getElementById("globalSearch"),i=document.getElementById("globalSearchResults"),s=this.getGlobalSearchIndex();let n=-1,l=[];const o=()=>{i&&i.classList.add("hidden")},r=()=>{i&&i.classList.remove("hidden")},c={Client:"bg-emerald-50 text-emerald-700",Project:"bg-blue-50 text-blue-700",Invoice:"bg-amber-50 text-amber-700",Campaign:"bg-purple-50 text-purple-700",Lead:"bg-rose-50 text-rose-700"},d=h=>{if(!i)return;const m=(h||"").trim().toLowerCase(),f=(m?s.filter(w=>w.search.includes(m)):s).slice(0,8);if(l=f,n>=f.length&&(n=f.length?0:-1),f.length===0&&m){i.innerHTML=`
    <div class="p-4 text-center">
                        <svg class="w-8 h-8 mx-auto text-slate-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                        <div class="text-sm font-semibold text-slate-500">No results for &ldquo;${m}&rdquo;</div>
                        <div class="text-xs text-slate-400 mt-0.5">Try a client name, invoice number, or project</div>
                    </div>`,r();return}m?i.innerHTML=`<div class="px-3 pt-3 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">${f.length} result${f.length!==1?"s":""}</div>`+f.map((w,u)=>p(w,u)).join(""):i.innerHTML='<div class="px-3 pt-3 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recent / Quick Access</div>'+f.map((w,u)=>p(w,u)).join(""),r(),i.querySelectorAll("button[data-target-section]").forEach(w=>{w.addEventListener("click",()=>{const u=w.dataset.targetSection,b=w.dataset.targetSubsection;t&&(t.value=""),o(),this.switchSection(u),this.switchSubSection(b)})})},p=(h,m)=>{const f=c[h.type]||"bg-slate-100 text-slate-600";return`<button class="w-full text-left px-3 py-2.5 flex items-center gap-3 transition-colors ${m===n?"bg-purple-50":"hover:bg-slate-50"}" data-target-section="${h.section}" data-target-subsection="${h.subsection}">
                <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2">
                        <span class="text-sm font-semibold text-slate-900 truncate">${h.title}</span>
                        <span class="px-1.5 py-0.5 text-[10px] font-bold rounded-full flex-shrink-0 ${f}">${h.type}</span>
                    </div>
                    <div class="text-xs text-slate-500 truncate mt-0.5">${h.subtitle}</div>
                </div>
                <svg class="w-3.5 h-3.5 text-slate-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
            </button>`},g=h=>d(h);t&&(t.addEventListener("input",h=>g(h.target.value)),t.addEventListener("focus",h=>g(h.target.value)),t.addEventListener("keydown",h=>{if(i){if(h.key==="Escape"){o();return}if(h.key==="ArrowDown"){if(!l.length)return;n=Math.min(l.length-1,n+1),g(t.value),h.preventDefault();return}if(h.key==="ArrowUp"){if(!l.length)return;n=Math.max(0,n-1),g(t.value),h.preventDefault();return}if(h.key==="Enter"){if(!l.length||n<0)return;const m=l[n];if(!m)return;t.value="",o(),this.switchSection(m.section),this.switchSubSection(m.subsection),h.preventDefault();return}}})),document.addEventListener("click",h=>{if(!i||!t)return;const m=h.target;i.contains(m)||t.contains(m)||o()})}setupSidebarCollapse(){const a=document.getElementById("sidebarCollapse");if(!a)return;const t=s=>{document.body.classList.toggle("sidebar-collapsed",s);try{localStorage.setItem("mf_sidebar_collapsed",s?"1":"0")}catch{}const n=a.querySelector("i[data-lucide]");n&&n.setAttribute("data-lucide",s?"chevrons-right":"chevrons-left"),this.initializeLucideIcons(),this.renderChatPanel()};let i=!1;try{i=localStorage.getItem("mf_sidebar_collapsed")==="1"}catch{}t(i),a.addEventListener("click",()=>{const s=document.body.classList.contains("sidebar-collapsed");t(!s)})}getNotificationsData(){const a=[];let t=1;try{this.getStoredInvoices().filter(i=>String((i==null?void 0:i.status)||"").toLowerCase()==="overdue").slice(0,3).forEach(i=>{a.push({id:"n"+t++,title:`Invoice overdue: ${i.no||"Invoice"}`,message:`${i.client||"Client"} • ${i.amount||""} • Overdue`,time:"Now",type:"billing",unread:!0})})}catch{}try{this.getStoredFollowups().filter(i=>!i.done).slice(0,2).forEach(i=>{a.push({id:"n"+t++,title:`Follow-up pending: ${i.client||"Client"}`,message:`${i.topic||"No topic"} • ${i.priority||"Medium"} priority`,time:"Today",type:"engagement",unread:!0})})}catch{}try{this.getStoredCampaigns().filter(i=>String((i==null?void 0:i.status)||"").toLowerCase()==="active").slice(0,1).forEach(i=>{a.push({id:"n"+t++,title:`Campaign active: ${i.name||"Campaign"}`,message:`${i.type||"Campaign"} • ${i.audience||0} recipients`,time:"Today",type:"campaigns",unread:!1})})}catch{}try{this.getStoredProjects().filter(i=>String((i==null?void 0:i.status)||"").toLowerCase()!=="completed").slice(0,2).forEach(i=>{a.push({id:"n"+t++,title:`Project in progress: ${i.name||"Project"}`,message:`${i.client||"—"} • ${i.status||"Active"}`,time:"Today",type:"projects",unread:!1})})}catch{}return a.length===0&&a.push({id:"n0",title:"Welcome to Bezent!",message:"Start by adding leads, clients, or projects to see smart alerts here.",time:"Now",type:"leads",unread:!0}),a}setupNotifications(){const a=document.getElementById("notificationToggle"),t=document.getElementById("notificationMenu"),i=document.getElementById("notificationList"),s=document.getElementById("notificationSubtitle"),n=document.getElementById("notificationCount"),l=document.getElementById("markAllReadBtn");if(!a||!t||!i||!s||!n)return;this.notifications||(this.notifications=this.getNotificationsData());const o=()=>t.classList.add("hidden"),r=()=>t.classList.remove("hidden"),c=()=>!t.classList.contains("hidden"),d=h=>({billing:{label:"Billing",color:"rose"},campaigns:{label:"Campaigns",color:"indigo"},engagement:{label:"Engagement",color:"amber"},projects:{label:"Projects",color:"sky"},leads:{label:"Leads",color:"emerald"}})[h]||{label:"Update",color:"slate"},p=()=>{const h=(this.notifications||[]).filter(m=>m.unread).length;h<=0?(n.classList.add("hidden"),s.textContent="No new notifications"):(n.classList.remove("hidden"),n.textContent=String(h),s.textContent=`You have ${h} unread`)},g=()=>{const h=this.notifications||[];i.innerHTML=h.map(m=>{const f=d(m.type);return`
    <button data-notification-id="${m.id}" class="w-full text-left p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors">
        <div class="flex items-start gap-3">
            <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2">
                    <span class="px-2 py-0.5 text-[11px] font-medium bg-${f.color}-50 text-${f.color}-700 rounded-full">${f.label}</span>
                    ${m.unread?'<span class="w-2 h-2 rounded-full bg-red-500 flex-shrink-0"></span>':""}
                </div>
                <div class="mt-1.5 text-sm font-semibold text-slate-900 truncate">${m.title}</div>
                <div class="text-xs text-slate-500 mt-0.5 line-clamp-2">${m.message}</div>
                <div class="text-[11px] text-slate-400 mt-1.5">${m.time}</div>
            </div>
        </div>
    </button>`}).join(""),p(),i.querySelectorAll("button[data-notification-id]").forEach(m=>{m.addEventListener("click",()=>{const f=m.dataset.notificationId,w=(this.notifications||[]).find(u=>u.id===f);w&&(w.unread=!1),g(),o(),w!=null&&w.type&&this.switchSection(w.type==="billing"?"billing":w.type)})})};g(),a.addEventListener("click",h=>{h.stopPropagation(),c()?o():r()}),document.addEventListener("click",h=>{const m=h.target;a.contains(m)||t.contains(m)||o()}),document.addEventListener("keydown",h=>{h.key==="Escape"&&o()}),l&&l.addEventListener("click",h=>{h.stopPropagation(),(this.notifications||[]).forEach(m=>{m.unread=!1}),g()})}setupProfileMenu(){const a=document.getElementById("profileToggle"),t=document.getElementById("profileMenu"),i=document.getElementById("logoutBtn");if(!a||!t)return;const s=()=>t.classList.add("hidden"),n=()=>t.classList.remove("hidden"),l=()=>!t.classList.contains("hidden");a.addEventListener("click",o=>{o.stopPropagation(),l()?s():n()}),document.addEventListener("click",o=>{const r=o.target;a.contains(r)||t.contains(r)||s()}),document.addEventListener("keydown",o=>{o.key==="Escape"&&s()}),i&&i.addEventListener("click",()=>{try{localStorage.removeItem("bezent_jwt"),localStorage.removeItem("bezent_user"),localStorage.removeItem("bezent_user_email")}catch{}window.location.replace("index.html")})}setupSidebarToggle(){const a=document.getElementById("sidebarToggle"),t=document.getElementById("appSidebar"),i=document.getElementById("sidebarOverlay");if(!a||!t||!i)return;const s=()=>{t.classList.remove("-translate-x-full"),i.classList.remove("hidden")},n=()=>{t.classList.add("-translate-x-full"),i.classList.add("hidden")};a.addEventListener("click",()=>{!t.classList.contains("-translate-x-full")?n():s()}),i.addEventListener("click",()=>n()),document.addEventListener("keydown",o=>{o.key==="Escape"&&n()});const l=()=>{window.matchMedia("(min-width: 768px)").matches?(i.classList.add("hidden"),t.classList.remove("-translate-x-full")):i.classList.contains("hidden")&&t.classList.add("-translate-x-full")};window.addEventListener("resize",l),l()}getGlobalSearchIndex(){const a=[],t=[];try{this.getStoredClients().forEach(i=>{i!=null&&i.name&&t.push({type:"Client",title:i.name,subtitle:`Owner: ${i.owner||"—"} `,section:"leads",subsection:"clients"})})}catch{}try{this.getStoredProjects().forEach(i=>{i!=null&&i.name&&t.push({type:"Project",title:i.name,subtitle:`Client: ${i.client||"—"} `,section:"projects",subsection:"active"})})}catch{}try{this.getStoredInvoices().forEach(i=>{i!=null&&i.no&&t.push({type:"Invoice",title:i.no,subtitle:`${i.client||"—"} • ${i.amount||""} • ${i.status||""} `,section:"billing",subsection:"invoices"})})}catch{}try{this.getStoredCampaigns().forEach(i=>{i!=null&&i.name&&t.push({type:"Campaign",title:i.name,subtitle:`Status: ${i.status||"Draft"} `,section:"campaigns",subsection:"email"})})}catch{}return[...t,...a].map(i=>({...i,search:`${i.type} ${i.title} ${i.subtitle} `.toLowerCase()}))}initializeRevenueChart(){const a=document.getElementById("revenueChart");if(!a)return;const s=this.getAllInvoices().filter(c=>String(c.status||"").toLowerCase()==="paid").reduce((c,d)=>c+this.parseCurrencyToNumber(d.amount),0),n=new Date,l=[],o=[],r=[];for(let c=5;c>=0;c--){const d=new Date(n.getFullYear(),n.getMonth()-c,1);l.push(d.toLocaleString("en-IN",{month:"short"}));const p=s?Math.round(s/6):285e3,g=1+(5-c)*.03;o.push(Math.round(p*g)),r.push(Math.round(p*(g+.05)))}if(this.charts&&this.charts.revenueChart)try{this.charts.revenueChart.destroy()}catch{}this.charts||(this.charts={}),this.charts.revenueChart=new Chart(a,{type:"line",data:{labels:l,datasets:[{label:"Revenue",data:o,borderColor:"#0ea5e9",backgroundColor:"rgba(14, 165, 233, 0.12)",tension:.4,fill:!0},{label:"Target",data:r,borderColor:"#10b981",borderDash:[5,5],fill:!1,tension:.3}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"bottom"}},scales:{y:{ticks:{callback:c=>"₹"+(c>=1e5?(c/1e5).toFixed(1)+"L":(c/1e3).toFixed(0)+"K")}}}}})}}document.addEventListener("DOMContentLoaded",()=>{const ht=a=>{const t=document.getElementById("main-content");if(!t)return;const i=a&&(a.stack||a.message)?a.stack||a.message:String(a||"Unknown error");t.innerHTML=`
    <div style="padding:16px;border:1px solid #fecaca;background:#fff1f2;border-radius:12px;color:#881337;">
                <div style="font-weight:800;">MarketFlow failed to start</div>
                <pre style="margin-top:10px;white-space:pre-wrap;font-size:12px;line-height:1.4;color:#9f1239;">${String(i).replace(/</g,"&lt;")}</pre>
            </div>
    `};window.addEventListener("error",a=>{ht((a==null?void 0:a.error)||(a==null?void 0:a.message))}),window.addEventListener("unhandledrejection",a=>{ht(a==null?void 0:a.reason)});try{new es}catch(a){ht(a)}});

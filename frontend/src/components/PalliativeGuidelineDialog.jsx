import { X } from 'lucide-react';
import './PalliativeGuidelineDialog.css';

export default function PalliativeGuidelineDialog({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="dialog-backdrop" onClick={onClose} />
      
      {/* Dialog */}
      <div className="dialog-container">
        <div className="dialog-header">
          <h2>Palliative Care Guidelines</h2>
          <button className="dialog-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <div className="dialog-content">
          <p>
            Here's a summary of the procedure suggested by the S3‑Leitlinie Palliativmedizin für Patienten mit einer nicht‑heilbaren Krebserkrankung (Version 2.1, January 2020) for caring for a patient with a non-curable cancer – <strong>this is a general framework</strong>; each step must be adapted to the individual patient.
          </p>

          <hr className="section-divider" />

          <h3>1. Early integration of palliative care</h3>
          <ul>
            <li>From the point when the cancer is assessed as non-curable, the patient and their relatives should be given information about palliative care options.</li>
            <li>Palliative care should be offered <em>in parallel</em> to tumour-directed therapy, not only after all tumour therapies stop.</li>
            <li>Assess whether specialist palliative services (e.g., specialised outpatient palliative care, inpatient palliative wards) are required based on complexity of symptoms, coordination needs etc.</li>
          </ul>

          <hr className="section-divider" />

          <h3>2. Assessment of needs and complexity</h3>
          <ul>
            <li>Repeatedly assess patient's needs in all four dimensions: physical, psychological, social and spiritual; also assess the needs of relatives.</li>
            <li>Determine the complexity of the situation, i.e., how many and how severe problems are present, how much coordination is needed, functioning status etc. This helps decide if general or specialised palliative care is required.</li>
          </ul>

          <hr className="section-divider" />

          <h3>3. Definition of therapy goals & shared decision-making</h3>
          <ul>
            <li>Discuss with patient (and relatives as appropriate) what the treatment goals are: for example prolongation of life, symptom control, quality of life, comfort, preferred place of care.</li>
            <li>Decisions about starting, continuing or stopping medical measures should be made in a participative way, considering patient's wishes, prognosis, risks/benefits.</li>
            <li>The plan should be revisited when clinical condition changes.</li>
          </ul>

          <hr className="section-divider" />

          <h3>4. Care provision (general vs specialised palliative care)</h3>
          <ul>
            <li><em>General palliative care</em> (generalist services) is provided by e.g., oncologists, general practitioners, nursing staff with palliative competence, for patients with lower complexity.</li>
            <li><em>Specialised palliative care</em> (e.g., outpatient specialised palliative care team, inpatient palliative ward) for patients with high symptom burden, complex needs, or high coordination demands.</li>
            <li>Relatives and informal carers also need to be included, supported, educated.</li>
          </ul>

          <hr className="section-divider" />

          <h3>5. Communication & advance planning</h3>
          <ul>
            <li>Ongoing, open, honest and empathetic communication with the patient and relatives about illness, prognosis, options, patient preferences.</li>
            <li>Advance care planning / anticipatory planning: discuss values, what the patient would want in future (e.g., if they cannot decide later), preferred setting of care, etc.</li>
          </ul>

          <hr className="section-divider" />

          <h3>6. Symptom management</h3>
          <ul>
            <li>The guideline contains detailed procedures for major symptoms (pain/tumour-pain, dyspnoea, nausea/vomiting, constipation, malignant intestinal obstruction, malignant wounds, fatigue, sleep disorders, anxiety, depression, etc.)</li>
            <li>Example: For tumour pain, follow the stepwise approach: assessment → non-opioids → opioids (WHO-step III) → adjuvants/neuropathic pain drugs, monitor side-effects etc.</li>
            <li>For dyspnoea: assess severity, non-medicinal measures (e.g., positioning, fan), opioids for relief, possibly oxygen if hypoxic etc.</li>
          </ul>

          <hr className="section-divider" />

          <h3>7. Care in the dying/terminal phase</h3>
          <ul>
            <li>Recognise when the patient enters the dying phase (Sterbephase). Start or intensify measures focusing on comfort, symptom relief, support for relatives.</li>
            <li>Common issues: breathing patterns, agitation, delirium, mouth dryness, pain, anxiety. Adjust or stop burdensome treatments no longer beneficial.</li>
            <li>After death: bereavement support, relatives' needs, staff support.</li>
          </ul>

          <hr className="section-divider" />

          <h3>8. Quality indicators & continuous evaluation</h3>
          <ul>
            <li>The guideline provides indicators to monitor quality of palliative care (e.g., timely symptom assessment, patient wishes documented, involvement of relatives).</li>
            <li>Regular review of goals, treatment plan and adaptation when patient's condition or wishes change.</li>
          </ul>

          <hr className="section-divider" />

          <h3>Suggested Step-by-Step Procedure for a Patient</h3>
          
          <h4>1. At diagnosis of non-curable cancer</h4>
          <ul>
            <li>Inform patient and relative(s) about palliative care options and what that means.</li>
            <li>Initiate first assessment: physical symptoms, psychological state, social situation, spiritual/existential concerns; also assess relatives' needs.</li>
            <li>Begin discussion about goals of care: what matters to patient, what they hope for, what they fear.</li>
          </ul>

          <h4>2. Within first weeks/months</h4>
          <ul>
            <li>Decide whether general palliative care is sufficient or if specialist palliative services are needed (based on complexity).</li>
            <li>Set up care team: oncologist, GP, nursing staff, palliative care specialist (if needed), social work, possibly spiritual care.</li>
            <li>Discuss advance care planning: patient preferences for future, preferred place of care, who should decide if they cannot.</li>
          </ul>

          <h4>3. Ongoing care</h4>
          <ul>
            <li>Regularly (e.g., every visit or when condition changes) reassess needs across the four dimensions (physical, psychological, social, spiritual) and relatives' needs.</li>
            <li>Re-assess complexity and adjust level of palliative care accordingly.</li>
            <li>Manage symptoms actively: treat pain, nausea, breathlessness, constipation etc. according to guideline algorithms.</li>
            <li>Communicate changes in disease status, prognosis, review goals with patient and relatives, adjust plan.</li>
          </ul>

          <h4>4. When deterioration occurs / near end of life</h4>
          <ul>
            <li>Recognise transition into dying phase: decline in function, increasing symptoms, less response to therapy.</li>
            <li>Shift focus to comfort, symptom relief, psychosocial and spiritual support, reduce burdensome interventions.</li>
            <li>Engage relatives: prepare for death, manage expectations, provide support and information.</li>
            <li>After death: bereavement support for relatives, debriefing for team.</li>
          </ul>

          <h4>5. Throughout</h4>
          <ul>
            <li>Document goals, preferences, care plan.</li>
            <li>Ensure interdisciplinary coordination, communication among team members.</li>
            <li>Monitor quality: e.g., did we assess symptoms in time? Are the patient's preferences respected?</li>
            <li>Adjust plan when new issues arise (e.g., new symptom, increased complexity).</li>
          </ul>

          <hr className="section-divider" />

          <h3>Important Considerations</h3>
          <ul>
            <li>The recommendations are <strong>guidance</strong>, not rigid rules: each patient is unique.</li>
            <li>Some interventions may be <em>off-label</em> (outside standard approval) and require explicit patient consent.</li>
            <li>The guideline deals with patients with <em>non-curable cancer</em>. If patient has other disease types, adaptation may be required.</li>
          </ul>

          <p className="guideline-reference">
            <strong>Reference:</strong> S3-Leitlinie Palliativmedizin für Patienten mit einer nicht-heilbaren Krebserkrankung (Version 2.1, January 2020)
          </p>
        </div>

        <div className="dialog-footer">
          <button className="dialog-close-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </>
  );
}

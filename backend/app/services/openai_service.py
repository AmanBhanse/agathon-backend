import os
from dotenv import load_dotenv
from openai import AzureOpenAI

# Load environment variables
load_dotenv()

class OpenAIService:
    """Service for interacting with Azure OpenAI API"""
    
    def __init__(self):
        self.endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
        self.api_key = os.getenv("AZURE_OPENAI_API_KEY")
        self.api_version = os.getenv("OPENAI_API_VERSION")
        self.deployment_name = os.getenv("OPENAI_DEPLOYMENT_NAME")
        
        self.client = AzureOpenAI(
            api_version=self.api_version,
            azure_endpoint=self.endpoint,
            api_key=self.api_key,
        )
    
    def generate_clinical_report(self, patient_data: dict) -> str:
        """
        Generate a clinical report for a tumor board case using Azure OpenAI.
        
        Args:
            patient_data: Dictionary containing patient information
            
        Returns:
            Clinical report summary from AI
        """
        prompt = self._construct_prompt(patient_data)
        
        try:
            response = self.client.chat.completions.create(
                model=self.deployment_name,
                temperature=0.0,  # deterministic output
                top_p=1.0,
                max_tokens=800,
                messages=[
                    {"role": "system", "content": "You are a clinical summarization assistant for tumor boards."},
                    {"role": "user", "content": prompt}
                ]
            )
            
            return response.choices[0].message.content
        except Exception as e:
            raise Exception(f"Error generating report: {str(e)}")
    
    @staticmethod
    def _construct_prompt(patient_data: dict) -> str:
        """
        Construct the clinical summary prompt from patient data.
        
        Args:
            patient_data: Dictionary containing patient information
            
        Returns:
            Formatted prompt string
        """
        prompt = f"""
You are an AI clinical summarization assistant for tumor boards. 
Use the timeline below to generate a step-by-step summary of the case, identify outdated or missing information, 
and produce a concise Final Assessment (5–10 sentences).

Timeline:
1. Tumor history: Tumoranamnese, Nebendiagnosen
2. Imaging: Bildgebung
3. Clinical Staging: Staging Klin cT, cN, cM, Staging Klin UICC
4. Histology + Pathological Staging: Histo Zyto, Staging Path pT, pN, pM, Staging Path UICC
5. Tumor Diagnosis: Tumordiagnose

Patient Data:
- Fallnummer: {patient_data.get('Case number', 'N/A')}
- Patient Age: {patient_data.get('Old', 'N/A')} years
- Tumor History: {patient_data.get('Tumor history', 'Not provided')}
- Secondary Diagnoses: {patient_data.get('Secondary diagnoses', 'None reported')}
- Imaging Findings: {patient_data.get('Imaging', 'Not provided')}
- Tumor Diagnosis: {patient_data.get('Tumor diagnosis', 'Not provided')}
- Histology & Cytology: {patient_data.get('Histo Cyto', 'Not provided')}
- Clinical Staging: cT={patient_data.get('Staging clinic cT', 'N/A')}, cN={patient_data.get('Staging Clinic N', 'N/A')}, cM={patient_data.get('Staging Clinic M', 'N/A')}, UICC={patient_data.get('Staging Clinic UICC', 'N/A')}
- Pathological Staging: pT={patient_data.get('Staging Path pT', 'N/A')}, pN={patient_data.get('Staging Path N', 'N/A')}, pM={patient_data.get('Staging Path M', 'N/A')}, UICC={patient_data.get('Staging Path UICC', 'N/A')}
- Treatment Approach: {'Curative' if patient_data.get('curative') == 1 else 'Palliative'}
- Prior Therapy: {patient_data.get('therapy so far', 'None documented')}

Instructions for AI:
1. Follow the timeline strictly.
2. Summarize each step in chronological order.
3. Identify any **missing, outdated, or conflicting information**.
4. Highlight differences between clinical vs pathological staging.
5. Provide a **concise final assessment** at the end.

Template for Output:
**Tumor History:** 1-2 sentences
**Imaging Findings:** 1-2 sentences
**Clinical Staging Summary:** 1-2 sentences
**Pathological Staging Summary:** 1-2 sentences
**Missing or Outdated Information:** List any missing or outdated information here.
**Final Assessment:** 5-10 sentences summarizing the case, noting any missing or outdated information.
"""
        return prompt


# Singleton instance
openai_service = OpenAIService()

from openai import OpenAI
import google.generativeai as genai
import anthropic
import os

class LLMModels:
    def __init__(self, provider: str, model: str, temperature: float, max_length: int, top_p: float, prompt: str, token: str):
        self.provider = provider.lower()
        self.model = model
        self.temperature = temperature
        self.max_length = max_length
        self.top_p = top_p
        self.prompt = prompt
        self.token = token
        self.response_log = []
        self.response = ''
        
    def call_openai(self):
        client = OpenAI(
            api_key=self.token
        )
        response = client.chat.completions.create(
            model=self.model,
            messages=[
            {"role": "system", "content": self.prompt},
            {"role": "user", "content": self.input_data}
            ],
            temperature=self.temperature,
            max_tokens=self.max_length,
            top_p=self.top_p,
            frequency_penalty=0,
            presence_penalty=0
        )
        self.response = response.choices[0].message.content
        self.response_log.append(self.response)

    def call_anthropic(self):
        client = anthropic.Anthropic(api_key=self.token)
        response = client.messages.create(
            model=self.model,
            max_tokens=self.max_length,
            temperature=self.temperature,
            system=self.prompt,
            messages=[
            {
                "role": "user",
                "content": [
                {
                    "type": "text",
                    "text": self.input_data
                }
                ]
            }
            ]
        )
        self.response = response.content
        self.response_log.append(self.response)

    def call_google(self):
        genai.configure(api_key=self.token)
        generation_config = {
            "temperature": self.temperature,
            "top_p": self.top_p,
            "max_output_tokens": self.max_length,
            "response_mime_type": "text/plain",
        }
        model = genai.GenerativeModel(
            model_name=self.model,
            generation_config=generation_config,
            system_instruction=self.prompt,
        )
        chat_session = model.start_chat(
            history=[
            ]
        )
        response = chat_session.send_message(self.input_data)
        self.response = response.text
        self.response_log.append(self.response)

    def route_call(self):
        if self.provider == "openai":
            return self.call_openai()
        elif self.provider == "anthropic":
            return self.call_anthropic()
        elif self.provider == "googlecloud":
            return self.call_google()
        else:
            raise ValueError(f"Unknown provider: {self.provider}")

    def call_llm(self, input_data):
        self.input_data = input_data
        self.route_call()
        return self.response, self.response_log
    

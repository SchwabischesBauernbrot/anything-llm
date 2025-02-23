import React, { memo, useEffect, useState } from "react";
import AnythingLLMIcon from "@/media/logo/anything-llm-icon.png";
import OpenAiLogo from "@/media/llmprovider/openai.png";
import AzureOpenAiLogo from "@/media/llmprovider/azure.png";
import AnthropicLogo from "@/media/llmprovider/anthropic.png";
import GeminiLogo from "@/media/llmprovider/gemini.png";
import OllamaLogo from "@/media/llmprovider/ollama.png";
import LMStudioLogo from "@/media/llmprovider/lmstudio.png";
import LocalAiLogo from "@/media/llmprovider/localai.png";
import System from "@/models/system";
import PreLoader from "@/components/Preloader";
import LLMProviderOption from "@/components/LLMSelection/LLMProviderOption";
import OpenAiOptions from "@/components/LLMSelection/OpenAiOptions";
import AzureAiOptions from "@/components/LLMSelection/AzureAiOptions";
import AnthropicAiOptions from "@/components/LLMSelection/AnthropicAiOptions";
import LMStudioOptions from "@/components/LLMSelection/LMStudioOptions";
import LocalAiOptions from "@/components/LLMSelection/LocalAiOptions";
import NativeLLMOptions from "@/components/LLMSelection/NativeLLMOptions";
import GeminiLLMOptions from "@/components/LLMSelection/GeminiLLMOptions";
import OllamaLLMOptions from "@/components/LLMSelection/OllamaLLMOptions";

function LLMSelection({ nextStep, prevStep, currentStep }) {
  const [llmChoice, setLLMChoice] = useState("openai");
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const updateLLMChoice = (selection) => {
    setLLMChoice(selection);
  };

  useEffect(() => {
    async function fetchKeys() {
      const _settings = await System.keys();
      setSettings(_settings);
      setLLMChoice(_settings?.LLMProvider || "openai");
      setLoading(false);
    }

    if (currentStep === "llm_preference") {
      fetchKeys();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {};
    const formData = new FormData(form);
    for (var [key, value] of formData.entries()) data[key] = value;
    const { error } = await System.updateSystem(data);
    if (error) {
      alert(`Failed to save LLM settings: ${error}`, "error");
      return;
    }
    nextStep("embedding_preferences");
  };

  if (loading)
    return (
      <div className="w-full h-full flex justify-center items-center p-20">
        <PreLoader />
      </div>
    );

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col w-full">
        <div className="flex flex-col w-full px-1 md:px-8 py-4">
          <div className="text-white text-sm font-medium pb-4">
            LLM Providers
          </div>
          <div className="w-full flex md:flex-wrap overflow-x-scroll gap-4 max-w-[752px]">
            <input hidden={true} name="LLMProvider" value={llmChoice} />
            <LLMProviderOption
              name="OpenAI"
              value="openai"
              link="openai.com"
              description="The standard option for most non-commercial use."
              checked={llmChoice === "openai"}
              image={OpenAiLogo}
              onClick={updateLLMChoice}
            />
            <LLMProviderOption
              name="Azure OpenAI"
              value="azure"
              link="azure.microsoft.com"
              description="The enterprise option of OpenAI hosted on Azure services."
              checked={llmChoice === "azure"}
              image={AzureOpenAiLogo}
              onClick={updateLLMChoice}
            />
            <LLMProviderOption
              name="Anthropic Claude 2"
              value="anthropic"
              link="anthropic.com"
              description="A friendly AI Assistant hosted by Anthropic. Provides chat services only!"
              checked={llmChoice === "anthropic"}
              image={AnthropicLogo}
              onClick={updateLLMChoice}
            />
            <LLMProviderOption
              name="Google Gemini"
              value="gemini"
              link="ai.google.dev"
              description="Google's largest and most capable AI model"
              checked={llmChoice === "gemini"}
              image={GeminiLogo}
              onClick={updateLLMChoice}
            />
            <LLMProviderOption
              name="LM Studio"
              value="lmstudio"
              link="lmstudio.ai"
              description="Discover, download, and run thousands of cutting edge LLMs in a few clicks."
              checked={llmChoice === "lmstudio"}
              image={LMStudioLogo}
              onClick={updateLLMChoice}
            />
            <LLMProviderOption
              name="Local AI"
              value="localai"
              link="localai.io"
              description="Run LLMs locally on your own machine."
              checked={llmChoice === "localai"}
              image={LocalAiLogo}
              onClick={updateLLMChoice}
            />
            <LLMProviderOption
              name="Ollama"
              value="ollama"
              link="ollama.ai"
              description="Run LLMs locally on your own machine."
              checked={llmChoice === "ollama"}
              image={OllamaLogo}
              onClick={updateLLMChoice}
            />
            {!window.location.hostname.includes("useanything.com") && (
              <LLMProviderOption
                name="Custom Llama Model"
                value="native"
                description="Use a downloaded custom Llama model for chatting on this AnythingLLM instance."
                checked={llmChoice === "native"}
                image={AnythingLLMIcon}
                onClick={updateLLMChoice}
              />
            )}
          </div>
          <div className="mt-4 flex flex-wrap gap-4 max-w-[752px]">
            {llmChoice === "openai" && <OpenAiOptions settings={settings} />}
            {llmChoice === "azure" && <AzureAiOptions settings={settings} />}
            {llmChoice === "anthropic" && (
              <AnthropicAiOptions settings={settings} />
            )}
            {llmChoice === "gemini" && <GeminiLLMOptions settings={settings} />}
            {llmChoice === "lmstudio" && (
              <LMStudioOptions settings={settings} />
            )}
            {llmChoice === "localai" && <LocalAiOptions settings={settings} />}
            {llmChoice === "ollama" && <OllamaLLMOptions settings={settings} />}
            {llmChoice === "native" && <NativeLLMOptions settings={settings} />}
          </div>
        </div>
        <div className="flex w-full justify-between items-center px-6 py-4 space-x-2 border-t rounded-b border-gray-500/50">
          <button
            onClick={prevStep}
            type="button"
            className="px-4 py-2 rounded-lg text-white hover:bg-sidebar"
          >
            Back
          </button>
          <button
            type="submit"
            className="border border-slate-200 px-4 py-2 rounded-lg text-slate-800 bg-slate-200 text-sm items-center flex gap-x-2 hover:text-white hover:bg-transparent focus:ring-gray-800 font-semibold shadow"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}

export default memo(LLMSelection);

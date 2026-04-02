# AI Coding Tool Research: Amazon Q Developer

## (1) Core Architecture
Amazon Q Developer is a cloud-integrated AI assistant. It is delivered through multiple touchpoints: a VS Code/JetBrains extension, the AWS Management Console, and a dedicated CLI. Its architecture is deeply integrated with the AWS ecosystem and identity management (IAM).

## (2) Multi-agent Capabilities
Q Developer uses specialized **Agents** for complex, multi-step tasks:
- **Software Development Agent**: Can take a feature request and implement it across multiple files.
- **Code Transformation Agent**: Specifically designed for large-scale upgrades (e.g., upgrading Java versions or migrating frameworks).
- **Security Agent**: Scans for vulnerabilities and suggests automated fixes.

## (3) LLM Provider Support
Q Developer is primarily powered by **Amazon Titan** and **Anthropic Claude** (specifically Claude 3 and 3.5 models) hosted on AWS Bedrock. This provides an enterprise-grade, secure LLM experience.

## (4) Key Innovative Features
- **AWS Ecosystem Integration**: Can troubleshoot AWS resource issues, explain billing, and suggest architecture improvements based on AWS best practices.
- **Automated Code Upgrades**: One of the few tools with a dedicated "Transformation" engine for legacy code modernization.
- **Enterprise Controls**: Strong emphasis on security, data privacy, and compliance within the AWS infrastructure.

## (5) Plugin/Extension System
While not as open as MCP-based tools, it integrates with **AWS services** and internal company data sources. It also supports customization through "customizations" where the model can be fine-tuned or grounded on a company's private codebase.

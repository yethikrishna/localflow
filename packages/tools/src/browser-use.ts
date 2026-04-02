export interface PageContent {
  url: string;
  title: string;
  text: string;
  links: string[];
}

export class BrowserUseTool {
  async navigate(url: string): Promise<PageContent> {
    console.log(`[BrowserUse] Navigating to ${url}`);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
      }
      const html = await response.text();
      
      // Basic extraction logic
      const titleMatch = html.match(/<title>(.*?)<\/title>/i);
      const title = titleMatch ? titleMatch[1] : url;
      
      const text = this.cleanHtml(html);
      const links = this.extractLinks(html, url);

      return {
        url,
        title,
        text,
        links
      };
    } catch (error: any) {
      console.error(`[BrowserUse] Error navigating to ${url}:`, error);
      throw error;
    }
  }

  async click(url: string, selector: string): Promise<void> {
    console.log(`[BrowserUse] [Stub] Clicking on ${selector} at ${url}`);
    // Record action log (stub)
    return Promise.resolve();
  }

  async type(selector: string, text: string): Promise<void> {
    console.log(`[BrowserUse] [Stub] Typing "${text}" into ${selector}`);
    // Record action log (stub)
    return Promise.resolve();
  }

  async screenshot(): Promise<string> {
    console.log(`[BrowserUse] Generating placeholder screenshot`);
    // Returns placeholder base64 or URL
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
  }

  async extractText(url: string): Promise<string> {
    const content = await this.navigate(url);
    return content.text;
  }

  private cleanHtml(html: string): string {
    // Very basic HTML to text conversion
    return html
      .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gmi, '')
      .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gmi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private extractLinks(html: string, baseUrl: string): string[] {
    const links: string[] = [];
    const linkRegex = /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/gi;
    let match;
    while ((match = linkRegex.exec(html)) !== null) {
      let href = match[2];
      if (href.startsWith('/')) {
        const urlObj = new URL(baseUrl);
        href = `${urlObj.origin}${href}`;
      } else if (!href.startsWith('http')) {
        href = `${baseUrl}/${href}`;
      }
      if (!links.includes(href)) {
        links.push(href);
      }
    }
    return links.slice(0, 20); // Limit to top 20 links
  }
}

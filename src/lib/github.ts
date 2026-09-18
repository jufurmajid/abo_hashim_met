/**
 * GitHub API Helper Service
 * Handles server-side syncing of JSON data files to the GitHub repository.
 */

export interface GitHubSyncOptions {
  filePath: string; // e.g. "src/data/products.json"
  content: string; // JSON string
  commitMessage: string;
}

export interface GitHubSyncResult {
  success: boolean;
  message: string;
  sha?: string;
}

export async function syncFileToGitHub(options: GitHubSyncOptions): Promise<GitHubSyncResult> {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO || 'abo-hashim-met';
  const branch = process.env.GITHUB_BRANCH || 'main';

  if (!token || token === 'your_github_personal_access_token' || !owner || owner === 'your_github_username_or_org') {
    console.warn('[GitHub Sync] Credentials not configured (GITHUB_TOKEN / GITHUB_OWNER). Changes saved locally only.');
    return {
      success: true,
      message: 'تم التحديث محلياً (لم يتم ضبط إعدادات GitHub API في متغيرات البيئة)',
    };
  }

  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${options.filePath}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'AboHashimStoreApp',
    'Content-Type': 'application/json',
  };

  try {
    // 1. Fetch current file SHA if exists
    let currentSha: string | undefined = undefined;
    const getRes = await fetch(`${url}?ref=${branch}`, { headers, cache: 'no-store' });

    if (getRes.ok) {
      const getData = await getRes.json();
      currentSha = getData.sha;
    }

    // 2. Encode UTF-8 content to Base64
    const contentBase64 = Buffer.from(options.content, 'utf-8').toString('base64');

    // 3. Commit updated file to GitHub
    const putBody: Record<string, unknown> = {
      message: options.commitMessage,
      content: contentBase64,
      branch,
    };

    if (currentSha) {
      putBody.sha = currentSha;
    }

    const putRes = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(putBody),
    });

    if (putRes.ok) {
      const putData = await putRes.json();
      return {
        success: true,
        message: 'تم التحديث والمزامنة مع GitHub بنجاح',
        sha: putData.content?.sha,
      };
    }

    const errData = await putRes.text();
    console.error('[GitHub Sync] Error from GitHub API:', putRes.status, errData);
    return {
      success: false,
      message: `فشلت المزامنة مع GitHub: ${putRes.statusText}`,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('[GitHub Sync] Exception:', errorMsg);
    return {
      success: false,
      message: `خطأ في الاتصال بـ GitHub API: ${errorMsg}`,
    };
  }
}

﻿using HtmlAgilityPack;
using Newtonsoft.Json;
using System.Text;

class FonctionsScrap
{
    public static async Task<List<Article>> ScrapLequipe()
    {
        List<Article> listeArticles = new List<Article>();
        using (var httpClient = new HttpClient())
        {
            var url = "https://www.lequipe.fr/Football/Ligue-1/";
            var html = await httpClient.GetStringAsync(url);

            var doc = new HtmlDocument();
            doc.LoadHtml(html);

            var linksArticle = new HashSet<string>();

            var articles = doc.DocumentNode.SelectNodes("//article");


            if (articles != null)
            {
                foreach (var article in articles)
                {
                    var links = article.SelectNodes(".//a");

                    if (links != null)
                    {
                        foreach (var link in links)
                        {
                            var href = link.GetAttributeValue("href", "");
                            linksArticle.Add(href);
                        }
                    }
                }
            }


            foreach (var linkArticle in linksArticle)
            {
                var urlArticle = $"https://www.lequipe.fr{linkArticle}";
                var htmlArticle = await httpClient.GetStringAsync(urlArticle);

                var docArticle = new HtmlDocument();
                docArticle.LoadHtml(htmlArticle);

                var articleText = "";
                var paragraphs = docArticle.DocumentNode.SelectNodes("//*[@class='Paragraph__content']");

                if (paragraphs != null)
                {
                    foreach (var paragraph in paragraphs)
                    {
                        articleText += paragraph.InnerText;
                    }
                }

                var data = new Dictionary<string, string>
                {
                    {"inputs", articleText},
                };

                var API_KEY_HUGGING_FACE = DotNetEnv.Env.GetString("API_KEY_HUGGING_FACE");
                var urlHuggingFace = "https://api-inference.huggingface.co/models/moussaKam/barthez-orangesum-abstract";
                using var client = new HttpClient();
                client.DefaultRequestHeaders.Add("Authorization", $"Bearer {API_KEY_HUGGING_FACE}");
                var res = await client.PostAsync(urlHuggingFace, new FormUrlEncodedContent(data));
                if (res.IsSuccessStatusCode)
                {
                    var content = await res.Content.ReadAsStringAsync();
                    var value = JsonConvert.DeserializeObject<List<HuggingSummary>>(content);
                    if (value != null)
                    {
                        var summary = value[0].summary_text;
                        listeArticles.Add(new Article(urlArticle, summary));
                    }
                }
            }

        }
        return listeArticles;
    }

    public static async Task<List<Article>> ScrapOneFootball()
    {
        List<Article> listeArticles = new List<Article>();
        using (var httpClient = new HttpClient())
        {
            var url = "https://onefootball.com/fr/competition/ligue-1-uber-eats-23";
            var html = await httpClient.GetStringAsync(url);

            var doc = new HtmlDocument();
            doc.LoadHtml(html);

            var links = new HashSet<string>();

            var linkNodes = doc.DocumentNode
                .Descendants("a")
                .Where(a => a.GetAttributeValue("href", "").StartsWith("/fr/news"));

            foreach (var linkNode in linkNodes)
            {
                var link = linkNode.GetAttributeValue("href", "");

                if (!links.Contains(link))
                {
                    links.Add(link);
                }
            }

            foreach (var linkNews in links)
            {
                var news = $"https://onefootball.com{linkNews}";
                var htmlNews = await httpClient.GetStringAsync(news);

                var docNews = new HtmlDocument();
                docNews.LoadHtml(htmlNews);

                var articleText = "";

                var divs = docNews.DocumentNode.SelectNodes("//*[@class='ArticleParagraph_articleParagraph__MrxYL']");

                if (divs != null)
                {
                    foreach (var div in divs)
                    {
                        var paragraph = div.SelectSingleNode(".//p");

                        if (paragraph != null)
                        {
                            articleText += paragraph.InnerText;
                        }
                    }
                }

                var data = new Dictionary<string, string>
                {
                    {"inputs", articleText},
                };

                var API_KEY_HUGGING_FACE = DotNetEnv.Env.GetString("API_KEY_HUGGING_FACE");
                var urlHuggingFace = "https://api-inference.huggingface.co/models/moussaKam/barthez-orangesum-abstract";
                using var client = new HttpClient();
                client.DefaultRequestHeaders.Add("Authorization", $"Bearer {API_KEY_HUGGING_FACE}");
                var res = await client.PostAsync(urlHuggingFace, new FormUrlEncodedContent(data));
                if (res.IsSuccessStatusCode)
                {
                    var content = await res.Content.ReadAsStringAsync();
                    var value = JsonConvert.DeserializeObject<List<HuggingSummary>>(content);
                    if (value != null)
                    {
                        var summary = value[0].summary_text;
                        listeArticles.Add(new Article(news, summary));
                    }
                }
            }
        }

        return listeArticles;
    }

    public static async Task SaveArticle(string url, string text)
    {
        using (HttpClient httpClient = new HttpClient())
        {
            string baseUrl = DotNetEnv.Env.GetString("API_URL");
            var requestBody = new
            {
                url = url,
                text = text
            };

            // Sérialisation de l'objet en JSON
            string jsonContent = Newtonsoft.Json.JsonConvert.SerializeObject(requestBody);

            // Créez le contenu de la requête à partir du corps
            HttpContent httpContent = new StringContent(jsonContent, Encoding.UTF8, "application/json");

            // Envoie une requête POST à l'URL spécifiée avec le contenu
            HttpResponseMessage response = await httpClient.PostAsync($"{baseUrl}/news", httpContent);
            if (response.IsSuccessStatusCode)
            {
                string responseContent = await response.Content.ReadAsStringAsync();
                Console.WriteLine("Réponse du serveur : " + responseContent);
            }
            else
            {
                Console.WriteLine("Erreur HTTP : " + response.StatusCode);
            }
        }
    }
}


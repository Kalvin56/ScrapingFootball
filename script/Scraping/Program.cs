using HtmlAgilityPack;
using DotNetEnv;

class Program
{
    static async Task Main(string[] args)
    {

        DotNetEnv.Env.Load();

        var articlesLequipe = await FonctionsScrap.ScrapLequipe();
        var articlesOneFootball = await FonctionsScrap.ScrapOneFootball();
        Console.WriteLine(articlesLequipe.Count);
        foreach (var article in articlesLequipe)
        {
            await FonctionsScrap.SaveArticle(article.url, article.text);
            Console.WriteLine(article.url);
            Console.WriteLine(article.text);
        }
        foreach (var article in articlesOneFootball)
        {
            await FonctionsScrap.SaveArticle(article.url, article.text);
            Console.WriteLine(article.url);
            Console.WriteLine(article.text);
        }
    }

}


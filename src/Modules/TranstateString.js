const Languages = {
    'Pt-br' : require('#lang/Pt-br'),
};

function ReplaceVars(text, vars)
{
    if (!vars || vars.length === 0) return text;

    for (const v in vars)
    {
        text = text.replace(`%${v}`, vars[v]);
    }

    return text;
}

module.exports = (lang, type, originalText, vars = []) => {
    const translatedText = Languages[lang]
    if (textLang)
    {

    }
};
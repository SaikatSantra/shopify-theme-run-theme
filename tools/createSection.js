// USAGE:
// npm run create:section -- --name=your-section-name
// You can use the --open flag to open these files automatically if supported.`npm run create:section -- --name=your-section-name --open`
// OR
// npm run create:section -- --name=your-section-name --folder=your-scss-folder-name

const fs = require("fs-extra");
const args = require("yargs").argv;
const open = require("open");
const chalk = require("chalk");
const path = require("path");
const upcaseName = args.name.charAt(0).toUpperCase() + args.name.slice(1);
const formattedName = upcaseName.replace(/-/g, " ");

const createSection = () => {
  if (!args.name) {
    console.log(chalk.red("!!!! Error : a name is required !!!"));
    console.log(
      `use ${chalk.blue("npm run create:section -- --name=your-section-name")} replacing the name value`,
    );
    return;
  }

  const sectionContent = `<section class="${args.name}">
  <div class="container">
    <div class="${args.name}__content">
      {% if section.settings.title != blank  %}
        <h2 class="heading-1">{{ section.settings.title }}</h2>
      {% endif %}
      {% if section.settings.content != blank %}
        <div class="${args.name}__rte">
          {{ section.settings.content }}
        </div>
      {% endif %}
      {% if section.settings.cta_link != blank %}
        <a href="{{ section.settings.cta_link }}" class="btn">{{ section.settings.cta_text }}</a>
      {% endif %}
    </div>
  </div>
</section>

{% schema %}
{
  "name": "${formattedName}",
  "settings": [
    {
      "type": "text",
      "id": "title",
      "label": "title"
    },
    {
      "type": "richtext",
      "id": "content",
      "label": "Content",
      "default": "<p></p>"
    },
    {
      "type": "text",
      "id": "cta_text",
      "label": "CTA Text"
    },
    {
      "type": "url",
      "id": "cta_link",
      "label": "CTA Link"
    }
  ],
  "presets": [
    {
      "name": "${formattedName}",
      "category": "Baseline"
    }
  ]
}
{% endschema %}`;

  const themeDir = fs.existsSync("./theme") ? "theme" : "theme-base";
  const sectionFile = `./${themeDir}/sections/${args.name}.liquid`;
  const stylesContent = `.${args.name} {\n\n}`;
  const stylesBase = "./src/styles/theme.scss";
  let styleInclude = "";
  let stylesFile = "";

  if (args.folder) {
    styleInclude = `\n@import './sections/${args.folder}/${args.name}';`;
    stylesFile = `./src/styles/sections/${args.folder}/_${args.name}.scss`;
    fs.mkdir(
      `./src/styles/sections/${args.folder}`,
      { recursive: true },
      (err) => {
        if (err) throw err;
      },
    );
  } else {
    styleInclude = `\n@import './sections/${args.name}';`;
    stylesFile = `./src/styles/sections/_${args.name}.scss`;
  }

  fs.access(sectionFile, fs.F_OK, (err) => {
    if (!err) {
      throw "Section already exists";
    }
  });

  fs.access(stylesFile, fs.F_OK, (err) => {
    if (!err) {
      throw "SCSS file already exists";
    }
  });

  fs.writeFile(sectionFile, sectionContent, function (err) {
    if (err) throw err;
  });

  fs.writeFile(stylesFile, stylesContent, function (err) {
    if (err) throw err;
  });

  fs.readFile(stylesBase, "utf8", function (err, data) {
    if (err) {
      throw err;
    }

    const commentIndex = data.indexOf("// Sections 🔛");
    if (commentIndex === -1) {
      throw 'Comment "// Sections 🔛" not found in the file';
    }

    const beforeComment = data.slice(0, commentIndex + "// Sections 🔛".length); // remove +1 to exclude the newline after the comment
    const afterComment = data.slice(commentIndex + "// Sections 🔛".length);

    const newData =
      beforeComment + "\n" + styleInclude + "\n" + afterComment.trim(); // add a newline before and after the new import

    fs.writeFile(stylesBase, newData, function (err) {
      if (err) throw err;
    });
  });

  const openFile = async () => {
    // Opens the image in the default image viewer and waits for the opened app to quit.
    await open(stylesFile, { wait: true });
    await open(sectionFile, { wait: true });
  };

  if (args.open) {
    openFile();
  }

  console.log(chalk.green("!!!! Section created successfully !!!"));
  console.log(
    "you can open the files by CTRL + Click or CMD + Click if your terminal and editor are linked.",
  );
  console.log(
    chalk.blue(`
    ${path.resolve(stylesFile)}
    ${path.resolve(sectionFile)}
  `),
  );
};

createSection();

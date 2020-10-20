import Joi from 'joi';
import anchorme from 'anchorme';

const UrlAttribute = Joi.object({
  redirectUrl: Joi.string().uri().required(),
  displayUrl: Joi.string().required(),
  range: Joi.object({
    start: Joi.number().min(0).required(),
    end: Joi.number().min(0).required(),
  }).required(),
});

const EmailAttribute = Joi.object({
  email: Joi.string().required(),
  range: Joi.object({
    start: Joi.number().min(0).required(),
    end: Joi.number().min(0).required(),
  }).required(),
});

const Schema = Joi.object({
  text: Joi.string().required(),
  entities: Joi.object({
    urls: Joi.array().items(UrlAttribute).required(),
    emails: Joi.array().items(EmailAttribute).required(),
  }).required(),
});

Schema.fromText = (text) => {
  function truncateUrl(url, maxLength) {
    if (url.length <= maxLength) {
      return url;
    }

    return url.slice(0, maxLength) + '…';
  }

  function listUrls(text) {
    return anchorme
      .list(text)
      .filter((link) => link.isURL)
      .map((link) => ({
        redirectUrl: link.protocol ? link.string : `http://${link.string}`,
        displayUrl: truncateUrl(link.string, 25),
        range: {
          start: link.start,
          end: link.end,
        },
      }));
  }

  function listEmails(text) {
    return anchorme
      .list(text)
      .filter((link) => link.isEmail)
      .map((link) => ({
        email: link.protocol
          ? link.string.substring(link.protocol.length)
          : link.string,
        range: {
          start: link.start,
          end: link.end,
        },
      }));
  }

  return {
    text,
    entities: {
      urls: listUrls(text),
      emails: listEmails(text),
    },
  };
};

export default Schema;

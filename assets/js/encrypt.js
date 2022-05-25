/*! Baoshuo's OI Blog (c80356a) | Baoshuo ( https://baoshuo.ren ) */
!(function (e, n) {
    var t = function (n) {
            return e.getElementById(n);
        },
        r = "oi.baoshuo.ren_key_salt_by_baoshuo",
        o = JSON.parse(
            (
                t("encrypt-data").innerHTML || t("encrypt-data").textContent
            ).trim()
        ),
        i = function (e) {
            return new Uint8Array(
                e.match(/[\da-f]{2}/gi).map(function (e) {
                    return parseInt(e, 16);
                })
            );
        },
        u = function (e) {
            return n.deriveKey(
                {
                    name: "PBKDF2",
                    hash: "SHA-256",
                    salt: new TextEncoder().encode(r).buffer,
                    iterations: 1024,
                },
                e,
                { name: "HMAC", hash: "SHA-256", length: 256 },
                !0,
                ["verify"]
            );
        },
        a = function (e) {
            return n.deriveKey(
                {
                    name: "PBKDF2",
                    hash: "SHA-256",
                    salt: new TextEncoder().encode(r).buffer,
                    iterations: 1024,
                },
                e,
                { name: "AES-CBC", length: 256 },
                !0,
                ["decrypt"]
            );
        },
        c = function (e) {
            return n.deriveBits(
                {
                    name: "PBKDF2",
                    hash: "SHA-256",
                    salt: new TextEncoder().encode(
                        "oi.baoshuo.ren_iv_salt_by_baoshuo"
                    ).buffer,
                    iterations: 512,
                },
                e,
                128
            );
        },
        s = function (e, t, r, o, u) {
            return n
                .decrypt({ name: "AES-CBC", iv: o }, r, i(e).buffer)
                .then(function (e) {
                    return ((r = t),
                    (o = u),
                    (a = e),
                    n.verify(
                        { name: "HMAC", hash: "SHA-256" },
                        o,
                        i(r).buffer,
                        a
                    )).then(function (n) {
                        return !!n && new TextDecoder().decode(e);
                    });
                    var r, o, a;
                })
                .catch(function (e) {
                    return !1;
                });
        },
        d = function (e) {
            return e.length >= 32
                ? Promise.resolve(!1)
                : (function (e) {
                      return n.importKey(
                          "raw",
                          new TextEncoder().encode(e),
                          { name: "PBKDF2" },
                          !1,
                          ["deriveKey", "deriveBits"]
                      );
                  })(e).then(function (e) {
                      return Promise.all([u(e), a(e), c(e)])
                          .then(function (e) {
                              var n = e[0];
                              return (function (e, n, t) {
                                  return s(
                                      o.encryptedContent,
                                      o.contentHmacDigest,
                                      e,
                                      n,
                                      t
                                  );
                              })(e[1], e[2], n).then(function (e) {
                                  if (e) {
                                      var n = t("post_content"),
                                          r = t("encrypt-panel");
                                      return (
                                          (n.innerHTML = e),
                                          (n.style.display = null),
                                          (r.style.display = "none"),
                                          !0
                                      );
                                  }
                                  return !1;
                              });
                          })
                          .then(function (e) {
                              return (
                                  !!e ||
                                  ((t("encrypt-message").innerHTML =
                                      "密码错误。"),
                                  !1)
                              );
                          });
                  });
        };
    t("submit").addEventListener("click", function () {
        return d(t("password").value);
    }),
        t("password").addEventListener("keydown", function (e) {
            "Enter" === e.key && d(t("password").value);
        });
})(document, window.crypto.subtle);

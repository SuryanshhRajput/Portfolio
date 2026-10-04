import { decks } from '../content/skills.js';
import { stackGroups, stackProjects } from '../content/stack.js';

export function Stack() {
  const toolCount = stackGroups.reduce((n, g) => n + g.rows.length, 0);
  let r = -1;
  return (
    <section className="stack" id="stack" data-tone="dark" aria-labelledby="stack-title">
      <header className="section-head">
        <p className="label">06 · Skills</p>
        <h2 className="section-title" id="stack-title" data-split="">
          Code, commerce, design and people.
        </h2>
        <p className="section-lede">
          Every skill here points to where I used it: a project on this page or a pass in the next chapter. Drag the globe,
          or point at a group to light it up.
        </p>
      </header>

      <div className="skills">
        <div className="globe" data-globe="" aria-hidden="true">
          <div className="globe__core">
            <span>{decks.reduce((n, d) => n + d.skills.length, 0)}</span>
            skills
          </div>
          <ul className="globe__chips">
            {decks.flatMap((d) =>
              d.skills.map((s) => (
                <li key={d.id + s.name} className="globe__chip" data-cat={d.id} style={{ ['--c' as string]: d.colour }}>
                  {s.name}
                </li>
              )),
            )}
          </ul>
        </div>

        <div className="decks">
          {decks.map((d) => (
            <section key={d.id} className="deck" data-deck={d.id} style={{ ['--c' as string]: d.colour }} aria-labelledby={`deck-${d.id}`}>
              <header className="deck__head">
                <h3 className="deck__title" id={`deck-${d.id}`}>
                  {d.title}
                </h3>
                <span className="deck__count">{String(d.skills.length).padStart(2, '0')}</span>
              </header>
              <p className="deck__blurb">{d.blurb}</p>
              <ul className="deck__list" role="list">
                {d.skills.map((s) => (
                  <li key={s.name}>
                    <span className="deck__name">{s.name}</span>
                    <span className="deck__where">{s.where}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>

      <details className="matrix">
        <summary>
          <span>Every tool against every project</span>
          <span className="matrix__hint">{toolCount} tools · open the map</span>
        </summary>
      <p className="stack__summary readout" data-stack-summary="" aria-live="polite">
        Point at a row or a column
      </p>

      <div className="stack__scroll" tabIndex={0} role="region" aria-label="Tools by project, scrollable table">
        <table className="stackmap" data-stackmap="">
          <caption className="vh">Which tools each project uses</caption>
          <thead>
            <tr>
              <th scope="col" className="stackmap__corner">
                <span className="label">Tool</span>
              </th>
              {stackProjects.map((p, c) => (
                <th key={p.id} scope="col" className="stackmap__proj" data-c={c} data-label={p.name}>
                  <a href={p.href} title={p.name}>
                    <span className="stackmap__short">{p.short}</span>
                    <span className="stackmap__full">{p.name}</span>
                  </a>
                </th>
              ))}
            </tr>
          </thead>
          {stackGroups.map((g) => (
            <tbody key={g.group}>
              <tr className="stackmap__group">
                <th scope="colgroup" colSpan={stackProjects.length + 1}>
                  {g.group}
                </th>
              </tr>
              {g.rows.map((row) => {
                r += 1;
                const ri = r;
                return (
                  <tr key={row.tool}>
                    <th scope="row" className="stackmap__tool" data-r={ri} data-label={row.tool} tabIndex={0}>
                      {row.tool}
                      <span className="stackmap__count">{row.used.length}</span>
                    </th>
                    {stackProjects.map((p, c) => {
                      const used = row.used.includes(p.id);
                      return (
                        <td key={p.id} data-r={ri} data-c={c} data-used={used ? 'true' : 'false'}>
                          {used ? (
                            <span className="stackmap__dot">
                              <span className="vh">Used in {p.name}</span>
                            </span>
                          ) : (
                            <span className="vh">Not used in {p.name}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          ))}
        </table>
      </div>
      </details>
    </section>
  );
}

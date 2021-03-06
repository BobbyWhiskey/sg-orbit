import { ExternalLink } from "@stories/components";
import { bool, string } from "prop-types";
import { getGithubUrl } from "./getGithubUrl";
import GithubLogo from "./assets/logo-github-32.png";

const propTypes = {
    path: string.isRequired,
    logo: bool
};

const defaultProps = {
    logo: false
};

export function GithubLink({ path, logo, children, ...rest }) {
    if (logo) {
        return (
            <div className="inline-flex items-center">
                <img src={GithubLogo} alt="Github" className="w5 h5 mr2" />
                <ExternalLink href={getGithubUrl(path)} {...rest}>{children}</ExternalLink>
            </div>
        );
    }

    return (
        <ExternalLink
            {...rest}
            href={getGithubUrl(path)}
        >
            {children}
        </ExternalLink>
    );
}

GithubLink.propTypes = propTypes;
GithubLink.defaultProps = defaultProps;

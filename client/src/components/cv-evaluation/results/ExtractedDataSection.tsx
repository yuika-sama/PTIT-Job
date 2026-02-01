import React from 'react';
import { Box, Card, CardContent, Chip, Divider, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { CVExtractedData } from '../../../types/cvEvaluation';

interface ExtractedDataSectionProps {
  data?: CVExtractedData;
}

const ExtractedDataSection: React.FC<ExtractedDataSectionProps> = ({ data }) => {
  const theme = useTheme();
  if (!data) return null;

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        Insights extracted from CV
      </Typography>

      {data.candidateName && (
        <Card sx={{ mb: 2, borderLeft: `4px solid ${theme.palette.info.main}` }}>
          <CardContent>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
              Detected candidate name
            </Typography>
            <Typography variant="h6" sx={{ color: theme.palette.info.main }}>
              {data.candidateName}
            </Typography>
          </CardContent>
        </Card>
      )}

      {typeof data.coverage === 'number' && (
        <Card sx={{ mb: 2, borderLeft: `4px solid ${theme.palette.success.main}` }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle2" fontWeight={600}>
                JD coverage
              </Typography>
              <Typography variant="h6" sx={{ color: theme.palette.success.main }}>
                {data.coverage}%
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {data.matchedSkills.map(skill => (
                <Chip
                  key={`matched-${skill}`}
                  label={`+ ${skill}`}
                  size="small"
                  sx={{
                    backgroundColor: `${theme.palette.success.main}15`,
                    color: theme.palette.success.main,
                  }}
                />
              ))}
              {data.missingSkills.map(skill => (
                <Chip
                  key={`missing-${skill}`}
                  label={`- ${skill}`}
                  size="small"
                  sx={{
                    backgroundColor: `${theme.palette.error.main}15`,
                    color: theme.palette.error.main,
                  }}
                />
              ))}
            </Box>
          </CardContent>
        </Card>
      )}

      <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
        {data.skills.length > 0 && (
          <Card sx={{ flex: 1, borderLeft: `4px solid ${theme.palette.primary.main}` }}>
            <CardContent>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                Skills detected ({data.skills.length})
              </Typography>
              <Box>
                {data.skills.map(skill => (
                  <Chip
                    key={skill}
                    label={skill}
                    size="small"
                    sx={{
                      m: 0.25,
                      backgroundColor: `${theme.palette.primary.main}15`,
                      color: theme.palette.primary.main,
                    }}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        )}

        <Card sx={{ flex: 1, borderLeft: `4px solid ${theme.palette.info.main}` }}>
          <CardContent>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
              Contact details
            </Typography>

            {renderContactBlock('Emails', data.emails, theme.palette.info.main)}
            {renderContactBlock('Phones', data.phones, theme.palette.info.main)}
            {renderContactBlock('Links', data.links, theme.palette.info.main)}
          </CardContent>
        </Card>
      </Box>

      {data.education?.length ? (
        <Card sx={{ mt: 2, borderLeft: `4px solid ${theme.palette.secondary.main}` }}>
          <CardContent>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
              Education
            </Typography>
            {data.education.map(item => (
              <Typography key={item} variant="body2" sx={{ mb: 0.5 }}>
                {item}
              </Typography>
            ))}
          </CardContent>
        </Card>
      ) : null}

      {data.experiences?.length ? (
        <Card sx={{ mt: 2, borderLeft: `4px solid ${theme.palette.warning.main}` }}>
          <CardContent>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
              Experience
            </Typography>
            {data.experiences.map(exp => (
              <Box key={exp.raw} sx={{ mb: 1.5 }}>
                <Typography variant="body1" fontWeight={600}>
                  {exp.title || exp.organization || 'Experience'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {exp.organization}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {exp.dates || 'N/A'}
                </Typography>
                <Divider sx={{ mt: 1 }} />
              </Box>
            ))}
          </CardContent>
        </Card>
      ) : null}

      {data.sections.length > 0 && (
        <Card sx={{ mt: 2, borderLeft: `4px solid ${theme.palette.grey[500]}` }}>
          <CardContent>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
              Sections detected
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
              {data.sections.map(section => (
                <Chip key={section} label={section} size="small" sx={{ m: 0.25 }} />
              ))}
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

function renderContactBlock(label: string, values: string[], color: string) {
  if (!values.length) return null;
  return (
    <Box sx={{ mb: 1 }}>
      <Typography variant="caption" color="text.secondary">
        {label}:
      </Typography>
      {values.map(value => (
        <Typography
          key={`${label}-${value}`}
          variant="body2"
          sx={{
            fontFamily: 'monospace',
            color,
            fontSize: '0.85rem',
          }}
        >
          {value}
        </Typography>
      ))}
    </Box>
  );
}

export default ExtractedDataSection;

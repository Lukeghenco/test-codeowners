import React, {useState} from 'react'
import {ActionList, ActionMenu, Avatar, Box, IconButton, Label, Link, Text} from '@primer/react'
import {KebabHorizontalIcon} from '@primer/octicons-react'
import {Ago} from '../../../react-shared/Ago'
import {SafeHTMLBox, SafeHTMLString} from '../../../react-shared/SafeHTML'
import '@github/clipboard-copy-element'

const actionListItemStyles = {
  p: 2,
  m: 0,
  borderRadius: 0,
  '&:focus:not([data-focus-visible-added])': {
    color: 'inherit',
    bg: 'inherit'
  },
 
}

const actionListLinkItemStyles = {
  ...actionListItemStyles,
  ':first-child': {
    mx: -2
  }
}

export interface DiffLineCommentBoxProps {
  viewer: {
    isSiteAdmin: boolean
    diffView: string
  }
  comment: {
    id: number
    author: {
      login: string
      avatarUrl: string
      url: string
    }
    repository: {
      owner: {
        login: string
      }
    }
    isMinimized: string
    path: string
    bodyHTML: string
    currentDiffResourcePath: string
    viewerDidAuthor: boolean
    stafftoolsUrl: string
  }
}

export default function DiffLineCommentBox({viewer, comment}: DiffLineCommentBoxProps) {
  const commentPublishedData = new Date(comment.publishedAt)

  const [isCommentActionsOpen, toggleCommentActions] = useState(false)

  const closeCommentActions = () => toggleCommentActions(false)

  return (
    <Box
      as="tr"
      sx={{
        borderColor: 'border.default',
        borderWidth: 1,
        borderStyle: 'solid',
        borderLeft: 0,
        borderRight: 0
      }}
    >
      <Box as="td" colSpan={viewer.diffView === 'split' ? 2 : 3}>
        <Box
          sx={{
            borderColor: 'border.default',
            borderWidth: [0, 0, 1],
            borderRadius: 2,
            borderStyle: 'solid',
            margin: 2,
            p: 3,
            maxWidth: ['100%', '100%', '714px'],
            display: 'block'
          }}
        >
          <Box>
            <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
              <Box>
                <Avatar alt="Avatar image for comment author" size={24} src={comment.author.avatarUrl} sx={{mr: 2}} />
                <Text as="strong" sx={{fontWeight: 'bold', mr: 1}}>
                  <Link
                    href={comment.author.url}
                    sx={{
                      color: 'fg.default',
                      '&:hover': {
                        color: 'accent.fg'
                      }
                    }}
                  >
                    {comment.author.login}
                  </Link>
                </Text>
                <Link
                  href={comment.currentDiffResourcePath}
                  sx={{
                    color: 'fg.muted',
                    fontWeight: '400',
                    '&:hover': {
                      color: 'accent.fg'
                    }
                  }}
                >
                  <Ago timestamp={commentPublishedData} />
                </Link>
              </Box>
              <Box>
                <Label sx={{mr: 1, textTransform: 'capitalize'}}>{comment.viewerRelationship.toLowerCase()}</Label>
                {comment.viewerDidAuthor && <Label>Author</Label>}
                <ActionMenu
                  open={isCommentActionsOpen}
                  onOpenChange={() => toggleCommentActions(!isCommentActionsOpen)}
                >
                  <ActionMenu.Anchor>
                    <IconButton
                      aria-label="Open comment options"
                      icon={KebabHorizontalIcon}
                      sx={{ml: 1}}
                      variant="invisible"
                    />
                  </ActionMenu.Anchor>
                  <ActionMenu.Overlay align="end" aria-label="Comment options menu" sx={{borderRadius: 2}}>
                    <ActionList
                      sx={{
                        p: 0
                      }}
                    >
                      <clipboard-copy
                        aria-label="Copy comment link"
                        value={`${window.location.origin}${comment.currentDiffResourcePath}`}
                        onClick={closeCommentActions}
                      >
                        <ActionList.Item sx={actionListItemStyles}>Copy link</ActionList.Item>
                      </clipboard-copy>
                      {viewer.isSiteAdmin && (
                        <>
                          <ActionList.Divider sx={{m: 0}} />
                          <ActionList.LinkItem
                            aria-label="View in Stafftools link"
                            href={comment.stafftoolsUrl}
                            sx={actionListLinkItemStyles}
                          >
                            View in Stafftools
                          </ActionList.LinkItem>
                        </>
                      )}
                    </ActionList>
                  </ActionMenu.Overlay>
                </ActionMenu>
              </Box>
            </Box>
            <Box sx={{ml: 5, mt: 2}}>
              <SafeHTMLBox
                as="div"
                data-testid={`Comment body html for comment ${comment.id}`}
                html={comment.bodyHTML as SafeHTMLString}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

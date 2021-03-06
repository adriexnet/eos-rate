import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import Collapse from '@material-ui/core/Collapse'
import { withStyles } from '@material-ui/core/styles'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { Link } from '@reach/router'
import { useTranslation } from 'react-i18next'

import routes from 'routes'

const styles = theme => ({
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: 240,
    height: '100vh',
    [theme.breakpoints.up('md')]: {
      position: 'relative'
    }
  },
  innerList: {
    backgroundColor: theme.palette.surface.main
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  },
  selectedItem: {
    backgroundColor: theme.palette.surface.main
  },
  link: {
    textDecoration: 'none',
    color: '#443f56'
  }
})

const Menu = ({ onClick, currentPathname, links, classes }) => (
  <List>
    {links
      .filter(({ label }) => label)
      .map(({ to, label, collapsedItems }) => {
        // FIXME: we should try to use mui's way, for some reason
        // it didn't work for me
        const isSelected = currentPathname === to
        const selectedStyle = {
          backgroundColor: '#f5f5f5',
          color: '#443f5b'
        }
        return (
          <React.Fragment key={`link-${to}`}>
            <Link
              to={to}
              className={classes.link}
              onClick={() => onClick && onClick(!!collapsedItems)}
            >
              <ListItem
                button
                ContainerProps={{
                  onClick: () => onClick && onClick(!!collapsedItems)
                }}
                selected={isSelected}
                style={isSelected ? selectedStyle : {}}
              >
                <ListItemText primary={label} />
              </ListItem>
            </Link>
            {collapsedItems && !!collapsedItems.length && (
              <Collapse
                className={classes.innerList}
                in={isSelected}
                timeout='auto'
              >
                {collapsedItems.map((Item, index) => (
                  <Item key={`${to}-collapsed-item-${index}`} />
                ))}
              </Collapse>
            )}
          </React.Fragment>
        )
      })}
  </List>
)

const MainDrawer = ({
  classes,
  theme,
  variant = 'desktop',
  onClose,
  open = false,

  currentPathname,
  ...props
}) => {
  const { t } = useTranslation('translations')
  return (
    <>
      <div className={classes.toolbar} />
      {variant === 'mobile' && (
        <Drawer
          variant='temporary'
          anchor={theme.direction === 'rtl' ? 'right' : 'left'}
          open={open}
          onClose={onClose}
          classes={{
            paper: classes.drawerPaper
          }}
          ModalProps={{
            keepMounted: true // Better open performance on mobile.
          }}
        >
          <Menu
            onClick={isCollapsible => {
              if (!isCollapsible) {
                onClose()
              }
            }}
            currentPathname={currentPathname}
            links={routes.map(route => ({
              to: route.path,
              label: t(route.drawerLabel),
              collapsedItems: route.drawerComponents
            }))}
            classes={classes}
            t={t}
          />
        </Drawer>
      )}
      {variant === 'desktop' && (
        <Drawer
          variant='persistent'
          open={open}
          classes={{
            paper: classes.drawerPaper
          }}
        >
          <Menu
            currentPathname={currentPathname}
            links={routes.map(route => ({
              to: route.path,
              label: t(route.drawerLabel),
              collapsedItems: route.drawerComponents
            }))}
            classes={classes}
            t={t}
          />
        </Drawer>
      )}
    </>
  )
}

Menu.propTypes = {
  classes: PropTypes.object,
  links: PropTypes.array,
  onClick: PropTypes.func,
  currentPathname: PropTypes.string
}

MainDrawer.propTypes = {
  classes: PropTypes.object,
  currentPathname: PropTypes.string,
  theme: PropTypes.object,
  variant: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool
}

const mapStateToProps = ({ location: { pathname: currentPathname } }) => ({
  currentPathname
})

const mapDispatchToProps = () => ({})

export default withStyles(styles, { withTheme: true })(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MainDrawer)
)
